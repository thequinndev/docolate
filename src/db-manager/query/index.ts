import { z } from "zod";
import { BaseQueryItem, ParamSchemaBase, QueriesByAlias, Query, QueryParametersCollapsed } from "../query.types";

export const queryParameters = <T extends Record<string, z.ZodType<any>>[]>(
    schemas: T
  ): QueryParametersCollapsed<T> => {
    let index = 0
    const indexMap: any = {}
    let finalSchema = z.object({})
    const collapsed = Object.fromEntries(
      schemas.map((record) => {
        const [key, schema] = Object.entries(record)[0] as [string, z.ZodType<any>];
        indexMap[index] = {
          key,
          schema
        }
        finalSchema = finalSchema.extend({
          [key]: schema
        })
        index++
        return [key, schema._type];
      })
    );

    const arrayResolver = (params: any) => {
      const finalParams: any[] = []
      for (const ind in indexMap) {
        const key = indexMap[ind].key
        const val = params[key]
        finalParams.push(indexMap[ind].schema.parse(val))
      }

      return finalParams
    }

    const keyValueResolver = (params: any) => {
      return finalSchema.parse(params)
    }

    return {
        collapsed,
        arrayResolver,
        keyValueResolver
    } as QueryParametersCollapsed<T>
  }

const exampleParams = queryParameters([
  { test: z.string() },
  { testDuplicate: z.number() },
  { testDuplicate: z.number() },
] as const);

exampleParams.collapsed

export const query = <
  Description extends string,
  Alias extends string,
  QueryString extends string,
  ParametersSchema extends QueryParametersCollapsed<ParamSchemaBase>,
  Returns extends z.ZodType<any>,
  QueryItem extends Query<
    Description,
    Alias,
    QueryString,
    ParametersSchema,
    Returns
  >,
>(
  query: QueryItem
) => {
  return query as QueryItem;
};

export const queryGroup = <
    Queries extends BaseQueryItem[]
>(queries: Queries) => {
    return queries.reduce((acc, item) => {
        //@ts-ignore
        acc[item.alias] = item
        return acc
    }, {})as QueriesByAlias<Queries>
}
