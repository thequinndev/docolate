import { z } from "zod";
import { EndpointBase } from "../endpoint";
import { zodToJsonSchema } from 'zod-to-json-schema'

type Errors = {
    path: string,
    operationId: string,
    method: string,
    message: string,
    severity: 'warning' | 'error'
}

export const apiBuilder = (config: {
    failOnError: boolean,
    defaultMetadata: any
}) => {

    let errors: Errors[] = []
    let apiPaths: any = {}

    const throwLastError = () => {
        throw new Error(JSON.stringify(errors[errors.length - 1], null, 2))
    }

    const addErrorMessage = (endpoint: EndpointBase, message: string, severity: Errors['severity']) => {
        errors.push({
            'message': message,
            'operationId': endpoint.operationId,
            'path': endpoint.path,
            'method': endpoint.method,
            severity
        })
    }

    const processSchema = (schema: z.ZodType<any>) => {
        const jsonSchema = zodToJsonSchema(schema) as any
        delete jsonSchema['$ref']
        delete jsonSchema['$schema']
        delete jsonSchema['additionalProperties']
        return jsonSchema
    }
    
    const processAccepts = (endpoint: EndpointBase, annotations?: any) => {
        const result = {} as any
        let parameters = [] as any[]
        const accepts = endpoint.accepts
        if (accepts?.body) {
            const schema = processSchema(accepts.body)
            annotations = annotations ?? {}
            result['requestBody'] = {
                ...buildContent(schema, annotations)
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
    
    const buildContent = (schema: any, annotations: any) => {
        const internalAnnotations = {} as any
        if (annotations.example) {
            internalAnnotations.example = annotations.example
            delete annotations.example
        }
        if (annotations.examples) {
            internalAnnotations.examples = annotations.examples
            delete annotations.examples
        }

        return {
            ...annotations,
            content: {
                'application/json': {
                    schema,
                    ...internalAnnotations
                }
            }
        }
    }

    const processReturns = (endpoint: EndpointBase, annotations?: any) => {
        const responses = {} as any
        const returns = endpoint.returns
        for (const statusCode in returns) {
            let annotation = annotations?.[statusCode] ?? {}
            if (Object.keys(annotation).length === 0) {
                annotation = config.defaultMetadata?.responses?.[statusCode] ?? {}
            }
            if (!annotation.description) {
                addErrorMessage(endpoint, `Description is missing for response status ${statusCode}`, 'error')
                if (config.failOnError) {
                    throwLastError()
                }
            }
            const responseItem = (returns as any)[statusCode]
            const schema = processSchema(responseItem)
            responses[statusCode] = {
                ...buildContent(schema, annotation)
            }
        }
        return {
            responses
        }
    }
    
    const newSpecFile = (specFile: any, endpointGroupList: any, documentAnnotations: any) => {
        apiPaths = {}
        errors = []

        for (const operationId in endpointGroupList) {
            const endpoint = endpointGroupList[operationId]
            buildEndpointBody(endpoint, documentAnnotations[operationId] ?? undefined)
        }

        return {
            ...specFile,
            paths: {
                ...apiPaths
            }
        }
    }

    const buildEndpointBody = (endpoint: EndpointBase, annotations?: any) => {
        const accepts = processAccepts(endpoint, annotations?.requestBody)
        const returns = processReturns(endpoint, annotations?.responses)
    
        const pathAnnotation = annotations?.path ?? {}
        if (!apiPaths[endpoint.path]) {
            apiPaths[endpoint.path] = {
                ...pathAnnotation,
            }
        }
    
        if (!apiPaths[endpoint.path][endpoint.method]) {
            apiPaths[endpoint.path][endpoint.method] = {}
        }
    
        apiPaths[endpoint.path][endpoint.method] = {
            ...apiPaths[endpoint.path][endpoint.method],
            ...{
                operationId: endpoint.operationId,
                ...accepts,
                ...returns
            }
        }

        if (errors.length && config.failOnError === false) {
            console.log(errors)
            console.log('The above errors will likely cause OpenAPI validation errors.')
            console.log('If you want errors to prevent the build from completing, please set failOnError: true')
            console.log('apiBuilder.build({failOnError: true})')
        }
    }

    return {
        buildEndpointBody,
        newSpecFile,
    }
}