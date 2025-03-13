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

type InferObjectForExamples<T extends object> = {
    [Key in keyof T]?: {
        description?: string
    } & ValidExamples<T[Key]>
}

export type InferPathParamsForExamples<
Endpoint extends EndpointBase
> = Endpoint['accepts'] extends {
    path: z.ZodObject<any>
} ? InferObjectForExamples<z.infer<Endpoint['accepts']['path']>> : never

export type InferQueryParamsForExamples<
Endpoint extends EndpointBase
> = Endpoint['accepts'] extends {
    query: z.ZodObject<any>
} ? InferObjectForExamples<z.infer<Endpoint['accepts']['query']>> : never


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

export type TagItem<Version extends OASVersions, TagName extends string> =
(Omit<(Version extends '3.0' ? oas30.TagObject : oas31.TagObject), 'name'>) & {
    name: TagName,
    description?: string,
    externalDocs?: oas31.TagObject['externalDocs']
}

export type MetaManagerConfig<
    SpecVersion extends OASVersions,
    Tags extends TagItem<SpecVersion, string>[],
    ExtraOperationMeta extends string[]
> = {
    version: SpecVersion,
    tags?: Tags,
    // Meta that doesn't exist natively in OpenAPI
    customOperationMeta?: ExtraOperationMeta,
}

type InferCustomMetaOperations<OperationMetaConfig extends MetaConfigBase<OASVersions>['customOperationMeta']> = OperationMetaConfig extends string[] ? {
    [Item in OperationMetaConfig[number]]?: any
} : never

export type InferTags<Tags> = Tags extends Record<string, true> ? {
    tags?: (keyof Tags)[]
} : {
    tags?: string[]
}

export type MetaConfigBase<SpecVersion extends OASVersions> = MetaManagerConfig<SpecVersion, TagItem<SpecVersion, string>[], string[]>

export type GetOperationSpecMeta<
    Version extends OASVersions,
    MetaConfig extends MetaConfigBase<Version>['customOperationMeta'],
    Tags extends Record<string, true>
> = Pick<Version extends '3.0' ? oas30.OperationObject : oas31.OperationObject,
'description' | 'summary' | 'deprecated' | 'security' | 'servers' | 'callbacks' | 'externalDocs'
> & InferCustomMetaOperations<MetaConfig>
& InferTags<Tags>

export type SafeTags<SpecVersion extends OASVersions, Tags extends (TagItem<SpecVersion, string>[] | undefined)> =
Tags extends {
    name: string
}[]
? {
    [Tag in Tags[number] as Tag['name']]: true
} : never