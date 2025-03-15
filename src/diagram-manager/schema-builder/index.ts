import { z } from "zod";
import { RelationshipData, RelationshipType, SchemaData } from "../mermaid/er-diagram/data";
import zodToJsonSchema from "zod-to-json-schema";
import { renderErDiagramObject } from "../mermaid/er-diagram/render/render-object";
import { aliasPlaceholder, tabRelations } from "../mermaid/formatting";
import { mermaidTemplate } from "../mermaid/template";

type SchemaEntityTypes = 'table' | 'view' | 'materialized view'

type EntityKeys<SchemaEntityType extends SchemaEntityTypes, EntitySchema extends z.ZodObject<any>> = SchemaEntityType extends 'table' ? 
EntitySchema extends z.ZodObject<any> ? (keyof z.infer<EntitySchema>)[]
 : never : never


export type SchemaEntityItem<
EntityName extends string,
SchemaEntityType extends SchemaEntityTypes,
EntitySchema extends z.ZodObject<any>,
> = {
    entityName: EntityName,
    entityType: SchemaEntityType,
    entitySchema: EntitySchema,
    primaryKeys?: EntityKeys<SchemaEntityType, EntitySchema>,
    foreignKeys?: EntityKeys<SchemaEntityType, EntitySchema>,
    uniqueKeys?: EntityKeys<SchemaEntityType, EntitySchema>,
    schema?: string,
    alias?: string,
}

export type SchemaEntityItemBase = SchemaEntityItem<
string,
SchemaEntityTypes,
z.ZodObject<any>
>

export const schemaEntity = <
SchemaEntityType extends SchemaEntityTypes,
EntityName extends string,
EntitySchema extends z.ZodObject<any>,
>(entity: SchemaEntityItem<EntityName, SchemaEntityType, EntitySchema>) => {
    return entity
}

export type EntitiesByEntityName<
  SchemaEntityItems extends SchemaEntityItemBase[],
> = {
  [Item in SchemaEntityItems[number] as Item["entityName"]]: Item;
};

export type GetEntityProperties<T extends SchemaEntityItemBase> = EntityKeys<T['entityType'], T['entitySchema']>

const LeftHand: Record<RelationshipType, string> = {
    ZeroOrOne: "|o",
    ExactlyOne: "||",
    ZeroOrMore: "}o",
    OneOrMore: "}|",
}
  
const RightHand: Record<RelationshipType, string> = {
    ZeroOrOne: "o|",
    ExactlyOne: "||",
    ZeroOrMore: "o{",
    OneOrMore: "|{",
}

type BuildConfig = {
    standaloneRelationships?: boolean
}

export const SchemaBuilder = <
EntityItems extends SchemaEntityItemBase[],
IndexedEntities extends EntitiesByEntityName<EntityItems>
>(config: {
    entities: EntityItems,
    otherEntities?: Record<string, string>
}) => {

    const relationshipStrings: string[] = []

    const _schemaData: SchemaData = {
        schemas: {},
        relationShips: [],
    }

    const _entityMap = config.entities.reduce((acc, entity) => {
      //@ts-ignore - This is valid
      acc[entity.entityName] = entity;
      return acc;
    }, {}) as IndexedEntities;

    const buildConstraints = (entity: SchemaEntityItemBase, property: string): string[] => {
        const constraints: string[] = []
        if ((entity.primaryKeys ?? []).includes(property)) {
            constraints.push('PK')
        }
        if ((entity.foreignKeys ?? []).includes(property)) {
            constraints.push('FK')
        }
        if ((entity.uniqueKeys ?? []).includes(property)) {
            constraints.push('UK')
        }
            
        return constraints
    }

    const buildRelationship = (relationshipData: RelationshipData) => {
        const leftHandEntity = resolveEntityName(relationshipData.from.entity)
        const leftHandType = LeftHand[relationshipData.from.relationshipType ?? 'ExactlyOne']
        const leftHandSide = `${tabRelations}${leftHandEntity} ${leftHandType}`
        const relationshipType = relationshipData.identifying ? '--' : '..'
        const rightHandType = LeftHand[relationshipData.to.relationshipType ?? 'ExactlyOne']
        const rightHandEntity = resolveEntityName(relationshipData.to.entity)
        const label = relationshipData.relationshipLabel ? `"${relationshipData.relationshipLabel}"` : '""'
        relationshipStrings.push(`${leftHandSide}${relationshipType}${rightHandType} ${rightHandEntity} : ${label}`)
    }

    const addRelationship = <
        FromEntity extends keyof IndexedEntities,
        ToEntity extends keyof IndexedEntities
    >(relationshipData: {
        identifying?: boolean,
        from: {
            entity: FromEntity,
            relationshipType?: RelationshipType,
        },
        to: {
            entity: ToEntity,
            relationshipType?: RelationshipType,
        },
        relationshipLabel?: string
    }) => {
        _schemaData.relationShips.push(relationshipData)
        buildRelationship(relationshipData)
        return {
            addRelationship,
            build,
        }
    }

    const resolveEntityName = (name: string): string => {
        if (name.includes('.')) {
          return name.split('.')[1].toUpperCase()
        }
      
        return name.toUpperCase()
      }

    const build = (buildConfig?: BuildConfig) => {
        const mermaidBlocks: string[] = []

        for (const entity of (Object.values(_entityMap) as SchemaEntityItemBase[])) {
            const schema = entity.schema ?? null
            const entityName = entity.entityName
            const entityId = schema ? `${schema}.${entityName}` : entityName

            const schemaIndex = schema ?? '*'
            if (!_schemaData.schemas[schemaIndex]) {
                _schemaData.schemas[schemaIndex] = {
                    schemaName: schema,
                    entities: {}
                }
            }

            _schemaData.schemas[schemaIndex].entities[entityId] = {
                name: entityName,
                properties: {}
            }

            for (const propertyName in entity.entitySchema.shape) {
                const jsonSchema = zodToJsonSchema(entity.entitySchema.shape[propertyName]) as any
                _schemaData.schemas[schemaIndex].entities[entityId].name = entityName,
                _schemaData.schemas[schemaIndex].entities[entityId].properties[propertyName] = {
                    constraints: buildConstraints(entity, propertyName),
                    name: propertyName,
                    defaultValue: jsonSchema.default ?? null,
                    dataType: jsonSchema.type ?? null,
                    coreDataType: jsonSchema.type ?? null,
                    description: {},
                    maxLength: jsonSchema.maxLength ?? jsonSchema.maximum ?? null,
                    scale: null,
                    precision: null,
                }
            }

            const alias = entity.alias ? `["${entity.alias}"]` : ''

            const mermaidBlock = renderErDiagramObject(_schemaData.schemas[schemaIndex].entities[entityId]).replace(aliasPlaceholder, alias)

            mermaidBlocks.push(mermaidBlock)
        }

        const _buildConfig = buildConfig ?? {
            standaloneRelationships: true
        } as BuildConfig

        const files: string[] = []
        if (_buildConfig.standaloneRelationships) {
            files.push(mermaidTemplate('erDiagram', relationshipStrings.join('\n')))

            files.push(mermaidTemplate('erDiagram', mermaidBlocks.join('\n')))

            return files
        }

        files.push(mermaidTemplate('erDiagram', [
            ...mermaidBlocks,
            ...relationshipStrings
        ].join('\n')))

        return files

    }

    return {
        addRelationship,
        build
    }
}
