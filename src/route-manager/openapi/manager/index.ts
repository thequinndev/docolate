import { apiBuilder } from "../../build-endpoint";
import { EndpointArrayByOperationIds, EndpointBase, InferRequestAccepts } from "@thequinndev/route-manager/endpoint";
import { OASVersions, GetResponseSpecMetaDefault, GetRequestBodySpecMeta, InferResponsesForExamples, InferPathsFromGroupForAnnotation } from '../openapi.types'

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
        paths?: InferPathsFromGroupForAnnotation<SpecVersion, Operations>,
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

        if (!annotations.paths) {
            (annotations.paths as any) = {}
        }

        if (!annotations.operations) {
            annotations.operations = {}
        }

        documentAnnotations.paths = {
            ...documentAnnotations.paths,
            ...annotations.paths
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