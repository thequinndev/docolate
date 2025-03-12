import { MetaManagerConfig, OASVersions, TagItem } from "../openapi.types"

export const OpenAPIMetaManager = <
    SpecVersion extends OASVersions,
    Tag extends TagItem<SpecVersion>,
    ExtraOperationMeta extends string,
>(config: MetaManagerConfig<
    SpecVersion, Tag[], ExtraOperationMeta[]>) => {
    return config
}