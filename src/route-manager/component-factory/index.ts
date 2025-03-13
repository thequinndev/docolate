import { z } from "zod";
import { RouteManagerErrors } from "../errors";
import { schemaIs } from "../utility";

export const ComponentFactory = <
SchemaItems extends string,
Schemas extends SchemaItems[],
ParameterItems extends string,
Parameters extends ParameterItems[]
>(config: {
    schemas: Schemas,
    parameters?: Parameters
}) => {
    const makeSchema = <T extends z.ZodType<any>, Id extends Schemas[number]>(schema: T, id: Id) => {
        if (schemaIs.array(schema)) {
            throw new Error(RouteManagerErrors.NoArrayRefs)
        }
        schema = schema.describe(id)
        return schema
    }

    const makeParameterItem = <T extends z.ZodType<any>, Id extends Parameters[number]>(parameter: T, id: Id) => {
        if (schemaIs.array(parameter)) {
            throw new Error(RouteManagerErrors.NoArrayParameter)
        }
        if (schemaIs.object(parameter)) {
            throw new Error(RouteManagerErrors.NoObjectParameter)
        }
        parameter = parameter.describe(id)
        return parameter
    }

    return {
        makeSchema,
        makeParameterItem
    }
}