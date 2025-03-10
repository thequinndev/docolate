import { z } from "zod";
import { RouteManagerErrors } from "../errors";

export const ComponentFactory = <SchemaItems extends string, Schemas extends SchemaItems[]>(config: {
    schemas: Schemas
}) => {
    const makeSchema = <T extends z.ZodType<any>, Id extends Schemas[number]>(schema: T, id: Id) => {
        if (schema instanceof z.ZodArray) {
            throw new Error(RouteManagerErrors.NoArrayRefs)
        }
        schema = schema.describe(id)
        return schema
    }
    return {
        makeSchema
    }
}