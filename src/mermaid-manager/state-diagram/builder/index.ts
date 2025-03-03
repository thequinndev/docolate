import { Mermaid } from "../../padding"

export type StateBuilderConfig<
    Entities extends Record<string,string>,
    Composites extends Record<string, CompositeBase>
> = {
    entities: Entities,
    composites?: Composites,
    settings?: {
        includeOrphans: boolean
    }
}

export type AvailableEntities<Entities extends Record<string,string>> = (keyof Entities) | '[*]'

export type AvailableComposites<Composites extends Record<string, CompositeBase> | undefined> =
Composites extends Record<string, CompositeBase> ? (keyof Composites) : never

type CompositeBase = {
    alias?: string,
    entities: Record<string, string>
}

export type CompositeEntitiesByKey<
    Composites extends Record<string, CompositeBase>,
    Key extends AvailableComposites<Composites>
> = AvailableEntities<Composites[Key]['entities']>

type BaseItem<T extends string> = {
    type: T
}

export type EntityRelationshipItem = BaseItem<'entity'> & {
    from: string,
    fromDescriptor: string | null,
    to: string,
    toDescriptor: string | null,
    relationshipDescription?: string,
}

export type CompositeRelationshipItem = BaseItem<'composite'> & {
    from: string,
    fromDescriptor: string | null,
    to: string,
    toDescriptor: string | null,
    relationshipDescription?: string,
}

export type ValidTypes = EntityRelationshipItem['type'] | CompositeRelationshipItem['type']

export const StateDiagramBuilder = <
    Entities extends Record<string,string>,
    EntityKeys extends AvailableEntities<Entities>,
    Composites extends Record<string, CompositeBase>,
    CompositeKeys extends AvailableComposites<Composites>
>(config: StateBuilderConfig<Entities, Composites>) => {

    const entityItems: EntityRelationshipItem[] = []
    const compositeItems: CompositeRelationshipItem[] = []

    const allTopLevelEntities: Record<string, string | null> = {...config.entities}
    for (const compositeKey in config.composites ?? {}) {
        allTopLevelEntities[compositeKey] = config.composites![compositeKey].alias ?? null
    }

    const getDescriptor = (key: string): string | null => {
        if (key === '[*]') {
            return null
        }

        return allTopLevelEntities[key]
    }

    const addEntityRelationship = (from: EntityKeys, to: EntityKeys, relationshipDescription?: string) => {
        entityItems.push({
            type: 'entity',
            from: from as string,
            fromDescriptor: getDescriptor(from as string),
            to: to as string,
            toDescriptor: getDescriptor(to as string),
            ...(
                relationshipDescription ? {relationshipDescription} : {}
            )
        })
    }

    const addCompositeRelationship = <CompositeKey extends CompositeKeys>(fromComposite: CompositeKeys, from: CompositeEntitiesByKey<Composites, CompositeKey>, to: CompositeEntitiesByKey<Composites, CompositeKey>, relationshipDescription?: string) => {
        compositeItems.push({
            type: 'composite',
            from: from as string,
            fromDescriptor: getDescriptor(from as string),
            to: to as string,
            toDescriptor: getDescriptor(to as string),
            ...(
                relationshipDescription ? {relationshipDescription} : {}
            )
        })
    }

    const compile = () => {
        const header: Record<string, string> = {}
        const relations: string[] = []

        for (const item of entityItems) {
            if (item.from !== '[*]') {
                header[item.from] = `${Mermaid.tab}${item.from}: ${item.fromDescriptor}`
            }
            if (item.to !== '[*]') {
                header[item.to] = `${Mermaid.tab}${item.to}: ${item.toDescriptor}`
            }

            const relationshipDescription = item.relationshipDescription ? `: ${item.relationshipDescription}` : ''
            relations.push(`${Mermaid.tab}${item.from} --> ${item.to}${relationshipDescription}`)
        }

        const headerAray = Object.values(header)
        const diagramRows = ([] as string[]).concat(headerAray).concat(relations)
        const diagramBody = diagramRows.join('\n')
        return `\`\`\`mermaid\nstateDiagram-v2\n${diagramBody}\n\`\`\``
    }

    const fromToEntity = (from: EntityKeys, to: EntityKeys, relationshipDescription?: string) => {
        addEntityRelationship(
            from,
            to,
            relationshipDescription
        )
    }

    const fromToComposite = <CompositeKey extends CompositeKeys>(fromComposite: CompositeKeys, from: CompositeEntitiesByKey<Composites, CompositeKey>, to: CompositeEntitiesByKey<Composites, CompositeKey>, relationshipDescription?: string) => {
        addCompositeRelationship(
            fromComposite,
            from,
            to,
            relationshipDescription
        )
    }

    const beginWith = (currentEntity: EntityKeys) => {
        return {
            to: buildEntityCallback(currentEntity),
        }
    }

    const buildEntityCallback = (lastFrom: EntityKeys) => {
        return (newTo: EntityKeys, newDescription?: string) => {
            fromToEntity(lastFrom, newTo, newDescription)
            return {
                to: buildEntityCallback(newTo),
                compile
            }
        }
    }

    const buildCompositeCallback = <CompositeKey extends CompositeKeys>(lastFromComposite: CompositeKey, lastFrom: CompositeEntitiesByKey<Composites, CompositeKey>) => {
        return (newTo: CompositeEntitiesByKey<Composites, CompositeKey>, newDescription?: string) => {

            fromToComposite<CompositeKey>(lastFromComposite, lastFrom, newTo, newDescription)
        
            return {
                to: buildCompositeCallback(lastFromComposite, newTo),
            }
        }
    }

    const buildComposite = <CompositeKey extends CompositeKeys>(composite: CompositeKey) => {
        const beginWith = (currentEntity: CompositeEntitiesByKey<Composites, CompositeKey>) => {
            return {
                to: buildCompositeCallback<CompositeKey>(composite, currentEntity),
            }
        }
        return {
            beginWith
        }
    }

    return {
        beginWith,
        buildComposite,
        compile
    }
}