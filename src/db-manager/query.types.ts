import { z } from "zod";

type SingleKeyRecord = Record<string, z.ZodType<any>>;
export type ParamSchemaBase = SingleKeyRecord[];

export type Query<
  Description extends string,
  Alias extends string,
  QueryString extends string,
  ParametersSchema extends QueryParametersCollapsed<Record<string, z.ZodType<any>>[]>,
  Returns extends z.ZodType<any>,
> = {
  description?: Description;
  alias: Alias;
  query: QueryString;
  parameters?: ParametersSchema;
  returns: Returns;
  onResultRetrieval?: (result: { rows: any[] }) => void;
};

export type BaseQueryItem = Query<
  string,
  string,
  string,
  QueryParametersCollapsed<Record<string, z.ZodType<any>>[]>,
  z.ZodType<any>
>;

export type QueriesByAlias<Queries extends BaseQueryItem[]> = {
  [K in Queries[number] as K["alias"]]: K;
};

export type GetQuery<
  QueryList extends QueriesByAlias<BaseQueryItem[]>,
  Key extends keyof QueryList,
> = QueryList[Key] extends BaseQueryItem ? QueryList[Key] : never;

export type QueryIn<T extends QueryParametersCollapsed<ParamSchemaBase> | undefined> =
  T extends QueryParametersCollapsed<ParamSchemaBase>
    ? T['collapsed']
    : never;

export type QueryOut<QueryItem extends BaseQueryItem> = z.infer<
  QueryItem["returns"]
>;

export type QueryParametersCollapsed<T extends ParamSchemaBase | undefined> = T extends ParamSchemaBase? {
  collapsed: {
    [K in T[number] extends infer R
      ? R extends Record<infer Key, infer Schema>
        ? Key extends string
          ? Schema extends z.ZodType<any>
            ? { key: Key; type: z.infer<Schema> }
            : never
          : never
        : never
      : never as K["key"]]: K["type"];
  };
  arrayResolver: (params: any) => any[],
  keyValueResolver: (params: any) => any
} : never;
