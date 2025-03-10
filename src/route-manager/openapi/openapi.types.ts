import { z } from "zod";
import { EndpointArrayByOperationIds, EndpointBase, StatusCodeRecord, ValidStatusCodes } from "../endpoint";
import { oas30, oas31 } from 'openapi3-ts'

export type OASVersions = '3.0' | '3.1'
type OmitUnusedSpecFields<T extends oas30.OpenAPIObject | oas31.OpenAPIObject> = Omit<T, 'paths' | 'components'>
export type InferSpecBodyFromVersion<Version extends OASVersions> = OmitUnusedSpecFields<
    Version extends '3.0' ? oas30.OpenAPIObject
    : Version extends '3.1' ? oas31.OpenAPIObject : never
>

type GetPathSpecMeta<Version extends OASVersions> = Pick<Version extends '3.0' ? oas30.PathItemObject : oas31.PathItemObject, 'description' | 'summary'>

export type GetRequestBodySpecMeta<Version extends OASVersions, T> = (Pick<(Version extends '3.0' ? oas30.RequestBodyObject : oas31.RequestBodyObject), 'description' | 'required'>)
& (T extends object ? ValidExamples<T> : {})

export type GetResponseSpecMetaDefault<Version extends OASVersions> = {
    [Status in ValidStatusCodes]?: Omit<Version extends '3.0' ? oas30.ResponseObject : oas31.ResponseObject, 'content'>
}

export type InferResponsesForExamples<
Version extends OASVersions,
Endpoint extends EndpointBase
> = Endpoint['returns'] extends StatusCodeRecord ? {
    [Status in keyof Endpoint['returns'] as Status]?: Endpoint['returns'][Status] extends z.ZodType<any>
    ? Omit<Version extends '3.0' ? oas30.ResponseObject : oas31.ResponseObject, 'content'> &  ValidExamples<z.infer<Endpoint['returns'][Status]>> : never
} : never

type ValidExamples<T> = {
    example?: T,
    examples?: {
        [name: string]: {
            value: T
        }
    }
}
export type ValidRefFormat = `#/components/${string}`

export type InferPathsFromGroupForAnnotation<Version extends OASVersions, Group extends EndpointArrayByOperationIds<EndpointBase[]>> = {
    [OperationId in keyof Group as Group[OperationId]['path']]?: GetPathSpecMeta<Version>
}

export type GetOperationSpecMeta<Version extends OASVersions> = Pick<Version extends '3.0' ? oas30.OperationObject : oas31.OperationObject,
'description' | 'summary' | 'deprecated' | 'security' | 'servers' | 'callbacks' | 'externalDocs'
>