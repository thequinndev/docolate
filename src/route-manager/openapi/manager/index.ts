import { apiBuilder } from "../../build-endpoint";
import { EndpointArrayByOperationIds, EndpointBase, InferRequestAccepts } from "@thequinndev/route-manager/endpoint";
import { OASVersions, GetResponseSpecMetaDefault, GetPathSpecMeta, GetRequestBodySpecMeta, InferResponsesForExamples } from '../openapi.types'

export const OpenAPIManager = <
    SpecVersion extends OASVersions
>(config: {
    version: SpecVersion,
    defaultMetadata?: {
        responses?: GetResponseSpecMetaDefault<SpecVersion>
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
            responses?: InferResponsesForExamples<SpecVersion, Operation>
        }) => {
            documentAnnotations[operationId as string] = annotations
            return {
                withAnnotation,
                addEndpointGroup
            }
        }
        endpointGroupList = {
            ...endpointGroupList,
            ...endpointGroup
        }
        return {
            withAnnotation,
            addEndpointGroup,
        }
    }

    const build = (buildConfig: {
        failOnError: boolean
    }) => {
        const builder = apiBuilder({
            failOnError: buildConfig.failOnError,
            defaultMetadata: config.defaultMetadata ?? {}
        })
        const spec = builder.newSpecFile(endpointGroupList, documentAnnotations)
        console.log(endpointGroupList)
        return {
            spec,
            errors: builder.getErrors()
        }
    }

    return {
        addEndpointGroup,
        build
    }
}