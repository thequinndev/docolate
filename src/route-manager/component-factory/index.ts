import { z } from "zod";

export const ComponentFactory = <SchemaItems extends string, Schemas extends SchemaItems[]>(config: {
    schemas: Schemas
}) => {
    const makeSchema = <T extends z.ZodType<any>, Id extends Schemas[number]>(schema: T, id: Id) => {
        schema = schema.describe(id)
        return schema
    }
    return {
        makeSchema
    }
}