import { Mermaid } from "../../padding"

export type StateBuilderConfig<Entities extends Record<string,string>> = {
    entities: Entities,
    settings?: {
        includeOrphans: boolean
    }
}

export type AvailableEntities<Entities extends Record<string,string>> = (keyof Entities) | '[*]'

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

export const StateDiagramBuilder = <
    Entities extends Record<string,string>
>(config: StateBuilderConfig<Entities>) => {

    const diagramItems: (EntityRelationshipItem)[] = []

    const getDescriptor = (key: AvailableEntities<Entities>): string | null => {
        if (key === '[*]') {
            return null
        }

        return config.entities[key]
    }

    const addEntityRelationship = (from: AvailableEntities<Entities>, to: AvailableEntities<Entities>, relationshipDescription?: string) => {
        diagramItems.push({
            type: 'entity',
            from: from as string,
            fromDescriptor: getDescriptor(from),
            to: to as string,
            toDescriptor: getDescriptor(to),
            ...(
                relationshipDescription ? {relationshipDescription} : {}
            )
        })
    }

    const compile = () => {
        const header: Record<string, string> = {}
        const relations: string[] = []

        for (const item of diagramItems) {
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

    const fromTo = (from: AvailableEntities<Entities>, to: AvailableEntities<Entities>, relationshipDescription?: string) => {
        addEntityRelationship(
            from,
            to,
            relationshipDescription
        )
    }

    const buildCallback = (lastFrom: AvailableEntities<Entities>) => {
        return (newTo: AvailableEntities<Entities>, newDescription?: string) => {
            fromTo(lastFrom, newTo, newDescription)
            return {
                to: buildCallback(newTo),
                compile
            }
        }
    }

    const beginWith = (currentEntity: AvailableEntities<Entities>) => {
        return {
            to: buildCallback(currentEntity),
        }
    }

    return {
        beginWith
    }
}