import { z } from "zod";
import { RouteManagerErrors } from "../errors";

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
        if (schema instanceof z.ZodArray) {
            throw new Error(RouteManagerErrors.NoArrayRefs)
        }
        schema = schema.describe(id)
        return schema
    }

    const makeParameterItem = <T extends z.ZodType<any>, Id extends Parameters[number]>(parameter: T, id: Id) => {
        if (parameter instanceof z.ZodArray) {
            throw new Error(RouteManagerErrors.NoArrayParameter)
        }
        if (parameter instanceof z.ZodObject) {
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