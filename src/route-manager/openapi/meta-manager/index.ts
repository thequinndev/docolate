import { MetaManagerConfig, OASVersions, TagItem } from "../openapi.types"

export const OpenAPIMetaManager = <
    SpecVersion extends OASVersions,
    TagName extends string,
    Tag extends TagItem<SpecVersion,TagName>,
    ExtraOperationMeta extends string,
>(config: MetaManagerConfig<
    SpecVersion, Tag[], ExtraOperationMeta[]>) => {
    return config
}