import { buildEndpointBody } from "../build-endpoint";
import { EndpointArrayByOperationIds, EndpointBase, InferRequestAccepts } from "../endpoint";
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

export const OpenAPIManager = <
    SpecVersion extends OASVersions,
    SpecBodyVersion extends InferSpecBodyFromVersion<SpecVersion>
>(config: {
    version: SpecVersion,
    specFile: SpecBodyVersion
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
            requestBody?: GetRequestBodySpecMeta<SpecVersion, RequestBody>
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

    const build = () => {
        let paths = {} as any
        for (const operationId in endpointGroupList) {
            const endpoint = endpointGroupList[operationId]
            paths = buildEndpointBody(paths, endpoint, documentAnnotations[operationId] ?? undefined)
        }

        const apiFile = {
            ...config.specFile,
            paths
        }

        return apiFile
    }

    return {
        addEndpointGroup,
        build
    }
}