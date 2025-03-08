import { z } from "zod";

type Methods = "get" | "post" | "put" | "patch" | "delete";

export type ValidSuccessCodes = 200 | 201;
export type ValidErrorCodes = 400 | 401 | 403 | 404 | 500;
export type ValidStatusCodes = ValidSuccessCodes | ValidErrorCodes;

type StatusCodeRecord = Partial<Record<ValidStatusCodes, z.ZodType<any>>>

type PathItem = `/${string}`;
type OperationIdBase = string

export type EndpointDefinition<
  OperationId extends OperationIdBase,
  Method extends Methods,
  Path extends PathItem,
  Accepts extends {
    path?: z.ZodObject<any>;
    query?: z.ZodObject<any>;
    body?: z.ZodObject<any>;
  },
  Returns extends StatusCodeRecord,
> = {
  operationId: OperationId;
  method: Method;
  path: Path;
  accepts?: Accepts;
  returns: Returns;
};

type EndpointByMethod<Method extends Methods> = EndpointDefinition<
  OperationIdBase,
  Method,
  PathItem,
  {
    path?: z.ZodObject<any>;
    query?: z.ZodObject<any>;
    body?: z.ZodObject<any>;
  },
  StatusCodeRecord
>;

export type EndpointBase = EndpointByMethod<Methods>;

export const makeEndpoint = <
OperationId extends OperationIdBase,
Method extends Methods,
Path extends PathItem,
Accepts extends {
  path?: z.ZodObject<any>;
  query?: z.ZodObject<any>;
  body?: z.ZodObject<any>;
},
Returns extends StatusCodeRecord,
Endpoint extends EndpointDefinition<
    OperationId,
    Method,
    Path,
    Accepts,
    Returns
>
>(
  endpoint: Endpoint
) => {
  return endpoint;
};

export type InferRequest<Endpoint extends EndpointBase> = Endpoint['accepts'] extends {
    path?: z.ZodObject<any>;
    query?: z.ZodObject<any>;
    body?: z.ZodObject<any>;
} ? {
    path: Endpoint['accepts']['path'] extends z.ZodObject<any> ? z.infer<Endpoint['accepts']['path']> : never
    params: Endpoint['accepts']['query'] extends z.ZodObject<any> ? z.infer<Endpoint['accepts']['query']> : never
    body: Endpoint['accepts']['body'] extends z.ZodObject<any> ? z.infer<Endpoint['accepts']['body']> : never
} : never

export type InferResponses<Endpoint extends EndpointBase> = Endpoint['returns'] extends StatusCodeRecord ? {
    [Status in keyof Endpoint['returns'] as Status]: Endpoint['returns'][Status] extends z.ZodType<any> ? z.infer<Endpoint['returns'][Status]> : never
} & {
    defaultSuccess: Endpoint['returns'][200] extends z.ZodType<any> ? z.infer<Endpoint['returns'][200]> : never
} : never

export type EndpointArrayByOperationIds<
  Endpoints extends EndpointBase[],
> = {
  [Item in Endpoints[number] as Item["operationId"]]: Item;
};

export const endpointGroup = <Endpoints extends EndpointBase[]>(
  endpoints: Endpoints,
  groupPath?: PathItem
): EndpointArrayByOperationIds<Endpoints> => {
  return endpoints.reduce((acc, endpoint) => {
    if (groupPath) {
      endpoint.path = `${groupPath}${endpoint.path}`;
    }

    //@ts-ignore - This is valid
    acc[endpoint.operationId] = endpoint;
    return acc;
  }, {}) as EndpointArrayByOperationIds<Endpoints>;
};
