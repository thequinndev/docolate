import { z } from "zod";

type Methods = "get" | "post" | "put" | "patch" | "delete";

export type ValidSuccessCodes = 
  200  // OK
| 201  // Created
| 202  // Accepted
| 203  // Non-Authoritative Information
| 204  // No Content
| 205  // Reset Content
| 206  // Partial Content
| 207  // Multi-Status (WebDAV)
| 208  // Already Reported (WebDAV)
| 226  // IM Used (HTTP Delta encoding)


export type ValidErrorCodes = 
  400  // Bad Request
| 401  // Unauthorized
| 402  // Payment Required
| 403  // Forbidden
| 404  // Not Found
| 405  // Method Not Allowed
| 406  // Not Acceptable
| 407  // Proxy Authentication Required
| 408  // Request Timeout
| 409  // Conflict
| 410  // Gone
| 411  // Length Required
| 412  // Precondition Failed
| 413  // Payload Too Large
| 414  // URI Too Long
| 415  // Unsupported Media Type
| 416  // Range Not Satisfiable
| 417  // Expectation Failed
| 418  // I'm a teapot (RFC 2324)
| 421  // Misdirected Request
| 422  // Unprocessable Entity (WebDAV)
| 423  // Locked (WebDAV)
| 424  // Failed Dependency (WebDAV)
| 425  // Too Early
| 426  // Upgrade Required
| 427  // Unassigned (not used)
| 428  // Precondition Required
| 429  // Too Many Requests
| 431  // Request Header Fields Too Large
| 451  // Unavailable For Legal Reasons
| 500  // Internal Server Error
| 501  // Not Implemented
| 502  // Bad Gateway
| 503  // Service Unavailable
| 504  // Gateway Timeout
| 505  // HTTP Version Not Supported
| 506  // Variant Also Negotiates
| 507  // Insufficient Storage (WebDAV)
| 508  // Loop Detected (WebDAV)
| 510  // Not Extended
| 511  // Network Authentication Required

export type ValidStatusCodes = ValidSuccessCodes | ValidErrorCodes;

export type AnchoredSchema<T> = z.ZodType<any> & {
  describe: (description: T) => ReturnType<z.ZodType<any>['describe']>
}

export type StatusCodeRecord = Partial<Record<ValidStatusCodes, z.ZodType<any>>>

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

export type InferRequestAccepts<Accepts extends EndpointBase['accepts'], AcceptKey extends 'path' | 'query' | 'body'> = AcceptKey extends keyof Accepts ?
Accepts[AcceptKey] extends z.ZodObject<any> ? z.infer<Accepts[AcceptKey]> : never
: never
export type InferRequest<Endpoint extends EndpointBase> = Endpoint['accepts'] extends {
    path?: z.ZodObject<any>;
    query?: z.ZodObject<any>;
    body?: z.ZodObject<any>;
} ? {
    path: InferRequestAccepts<Endpoint['accepts'], 'path'>
    params: InferRequestAccepts<Endpoint['accepts'], 'query'>
    body: InferRequestAccepts<Endpoint['accepts'], 'body'>
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

export const RouteManager = () => {

  const endpoint = <
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

  const endpointGroup = <Endpoints extends EndpointBase[]>(
    endpoints: Endpoints
  ): EndpointArrayByOperationIds<Endpoints> => {
    return endpoints.reduce((acc, endpoint) => {
      //@ts-ignore - This is valid
      acc[endpoint.operationId] = endpoint;
      return acc;
    }, {}) as EndpointArrayByOperationIds<Endpoints>;
  };

  return {
    endpoint,
    endpointGroup
  }
}