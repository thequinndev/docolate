import { z } from "zod"
import { SchemaBuilder, schemaEntity } from "../../../src/diagram-manager/schema-builder"

const customersTable = schemaEntity({
    entityType: 'table',
    entityName: 'customers',
    entitySchema: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().max(100),
    }),
    primaryKeys: ['id']
})

const ordersTable = schemaEntity({
    entityName: 'orders',
    entitySchema: z.object({
        id: z.number(),
        customer_id: z.number(),
        name: z.string(),
        description: z.string().max(100),
    }),
    entityType: 'table',
    primaryKeys: ['id'],
    foreignKeys: ['customer_id']
})


const schemaBuilder = SchemaBuilder({
    entities: [
        customersTable,
        ordersTable
    ]
})

schemaBuilder.addRelationship({
    from: {
        entity: 'customers',
        relationshipType: 'ExactlyOne',
    },
    to: {
        entity: 'orders',
        relationshipType: 'OneOrMore',
    }
})

const diagram = schemaBuilder.build()
console.log(diagram)