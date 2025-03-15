export type EntityPropertyData = {
    name: string,
    defaultValue: string | null,
    dataType: string,
    coreDataType: string,
    constraints: string[],
    description: {
        propertyComment?: string,
        maxValueComment?: string
    },
    maxLength: string | null,
    scale: string | null,
    precision: string | null,
}

export type EntityData = {
    name: string,
    properties: {
        [keyof: string]: EntityPropertyData
    }
}

export type RelationshipType = 'ZeroOrOne' | 'ExactlyOne' | 'ZeroOrMore' | 'OneOrMore'

export type RelationshipData = {
    identifying?: boolean,
    from: {
        entity: any,
        relationshipType?: RelationshipType,
    },
    to: {
        entity: any,
        relationshipType?: RelationshipType,
    },
    relationshipLabel?: string,
}

export type SchemaData = {
    schemas: Record<string, {
        schemaName: string | null,
        entities: Record<string, EntityData>
    }>,
    relationShips: RelationshipData[]
}
