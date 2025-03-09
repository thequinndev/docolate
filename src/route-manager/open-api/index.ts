import { apiBuilder } from "../build-endpoint";
import { EndpointArrayByOperationIds, EndpointBase, InferRequestAccepts, ValidStatusCodes } from "../endpoint";
import { oas30, oas31 } from 'openapi3-ts'

type OASVersions = '3.0' | '3.1'
type OmitUnusedSpecFields<T extends oas30.OpenAPIObject | oas31.OpenAPIObject> = Omit<T, 'paths' | 'components'>
type InferSpecBodyFromVersion<Version extends OASVersions> = OmitUnusedSpecFields<
    Version extends '3.0' ? oas30.OpenAPIObject
    : Version extends '3.1' ? oas31.OpenAPIObject : never
>

type GetPathSpecMeta<Version extends OASVersions> = Pick<Version extends '3.0' ? oas30.PathItemObject : oas31.PathItemObject, 'description' | 'summary'>

type GetRequestBodySpecMeta<Version extends OASVersions, T> = (Pick<Version extends '3.0' ? oas30.RequestBodyObject : oas31.RequestBodyObject, 'description' | 'required'>) & T extends object ? {
    example?: T,
    examples?: {
        [name: string]: T
    }
} : {}

type GetResponseSpecMeta<Version extends OASVersions> = {
    [Status in ValidStatusCodes]?: Omit<Version extends '3.0' ? oas30.ResponseObject : oas31.ResponseObject, 'content'>
}

export type ValidRefFormat = `#/components/${string}`

type RefFormats = {
    schemas: ValidRefFormat,
    parameters: ValidRefFormat
}

export const OpenAPIManager = <
    SpecVersion extends OASVersions,
    SpecBodyVersion extends InferSpecBodyFromVersion<SpecVersion>
>(config: {
    version: SpecVersion,
    specFile: SpecBodyVersion,
    defaultMetadata?: {
        responses?: GetResponseSpecMeta<SpecVersion>
    }
}) => {
    const documentAnnotations: any = {}
    let endpointGroupList: any = {}

    const addEndpointGroup = <
        Operations extends EndpointArrayByOperationIds<EndpointBase[]>,
    >(endpointGroup: Operations) => {
        const withAnnotation = <
            OperationId extends keyof Operations,
            Operation extends Operations[OperationId],
            RequestBody extends InferRequestAccepts<Operation['accepts'], 'body'>
        >(operationId: OperationId, annotations: {
            path?: GetPathSpecMeta<SpecVersion>,
            requestBody?: GetRequestBodySpecMeta<SpecVersion, RequestBody>,
            responses?: GetResponseSpecMeta<SpecVersion>
        }) => {
            documentAnnotations[operationId as string] = annotations

            endpointGroupList = {
                ...endpointGroupList,
                ...endpointGroup
            }
            return {
                withAnnotation,
                addEndpointGroup
            }
        }
        return {
            withAnnotation,
            addEndpointGroup,
        }
    }

    const build = (buildConfig: {
        failOnError?: boolean
    }) => {
        const builder = apiBuilder({
            failOnError: buildConfig.failOnError ?? false,
            defaultMetadata: config.defaultMetadata ?? {}
        })
        return builder.newSpecFile(config.specFile, endpointGroupList, documentAnnotations)
    }

    return {
        addEndpointGroup,
        build
    }
}