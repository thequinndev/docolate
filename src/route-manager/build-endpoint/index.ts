import { z } from "zod";
import { EndpointBase } from "../endpoint";
import { zodToJsonSchema } from 'zod-to-json-schema'

const processSchema = (schema: z.ZodType<any>) => {
    const jsonSchema = zodToJsonSchema(schema) as any
    delete jsonSchema['$ref']
    delete jsonSchema['$schema']
    delete jsonSchema['additionalProperties']
    return jsonSchema
}

const processAccepts = (accepts: EndpointBase['accepts'], annotations?: any) => {
    const result = {} as any
    let parameters = [] as any[]
    if (accepts?.body) {
        const schema = processSchema(accepts.body)
        annotations = annotations ?? {}
        result['requestBody'] = {
            ...annotations,
            ...buildContent(schema)
        }
    }

    if (accepts?.path) {
        parameters = buildParams('path', accepts.path, parameters)
    }

    if (accepts?.query) {
        parameters = buildParams('query', accepts.query, parameters)
    }

    if (parameters.length) {
        result['parameters'] = parameters
    }

    return result
}

const buildParams = (inType: 'query' | 'path', paramSchema: z.ZodObject<any>, parameters: any[]) => {
    for (const name in paramSchema.shape) {
        const schema = processSchema(paramSchema.shape[name])
        const required = paramSchema.shape[name].isOptional() === false
        const item = {
            in: inType,
            name,
            required,
            schema
        }
        parameters.push(item)
    }
    
    return parameters
}

const buildContent = (schema: any) => {
    return {
        content: {
            'application/json': {
                schema
            }
        }
    }
}

const processReturns = (returns: EndpointBase['returns'], annotations?: any) => {
    const responses = {} as any
    for (const statusCode in returns) {
        const annotation = annotations?.[statusCode] ?? {}
        const responseItem = (returns as any)[statusCode]
        const schema = processSchema(responseItem)
        responses[statusCode] = {
            ...annotation,
            ...buildContent(schema)
        }
    }
    return {
        responses
    }
}

export const buildEndpointBody = (apiBody: any, endpoint: EndpointBase, annotations?: any) => {
    const accepts = processAccepts(endpoint.accepts, annotations?.requestBody)
    const returns = processReturns(endpoint.returns, annotations?.responses)

    const pathAnnotation = annotations?.path ?? {}
    if (!apiBody[endpoint.path]) {
        apiBody[endpoint.path] = {
            ...pathAnnotation,
        }
    }

    if (!apiBody[endpoint.path][endpoint.method]) {
        apiBody[endpoint.path][endpoint.method] = {}
    }

    apiBody[endpoint.path][endpoint.method] = {
        ...apiBody[endpoint.path][endpoint.method],
        ...{
            ...accepts,
            ...returns
        }
    }

    return apiBody
}