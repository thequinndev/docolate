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
    let documentAnnotations: any = {}
    let endpointGroupList: any = {}

    const addEndpointGroup = <
        Operations extends EndpointArrayByOperationIds<EndpointBase[]>,
    >(endpointGroup: Operations, annotations?: {
        path?: GetPathSpecMeta<SpecVersion>,
        operations?: {
            [OperationId in keyof Operations]?: {
                operation?: any,
                requestBody?: GetRequestBodySpecMeta<SpecVersion, InferRequestAccepts<Operations[OperationId]['accepts'], 'body'>>,
                responses?: InferResponsesForExamples<SpecVersion, Operations[OperationId]>
            }
        }

    }) => {

        if (!annotations) {
            annotations = {}
        }

        if (!annotations.path) {
            annotations.path = {}
        }

        if (!annotations.operations) {
            annotations.operations = {}
        }

        documentAnnotations.path = {
            ...documentAnnotations.path,
            ...annotations.path
        }

        documentAnnotations.operations = {
            ...documentAnnotations.operations,
            ...annotations.operations
        }

        endpointGroupList = {
            ...endpointGroupList,
            ...endpointGroup
        }
        return {
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