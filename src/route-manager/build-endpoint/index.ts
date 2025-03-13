import { z } from "zod";
import { EndpointBase } from "../endpoint";
import { SchemaProcessor } from "../schema-process";
import { RouteManagerErrors } from "../errors";
import { getParamsFromPath } from "../path-param-get";

export type Error = {
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

    let errors: Error[] = []
    let apiPaths: any = {}

    const schemaProcessor = SchemaProcessor()

    const throwLastError = () => {
        throw new Error(JSON.stringify(errors[errors.length - 1], null, 2))
    }

    const addErrorMessage = (endpoint: EndpointBase, message: string, severity: Error['severity']) => {
        errors.push({
            'message': message,
            'operationId': endpoint.operationId,
            'path': endpoint.path,
            'method': endpoint.method,
            severity
        })
    }

    const processAccepts = (endpoint: EndpointBase, annotations?: any) => {
        const result = {} as any
        let parameters = [] as any[]
        const accepts = endpoint.accepts
        if (accepts?.body) {
            const schema = schemaProcessor.processSchema(accepts.body)
            annotations = annotations ?? {}
            result['requestBody'] = {
                ...buildContent(schema, annotations)
            }
        }
    
        if (accepts?.path) {
            parameters = buildParams(endpoint, 'path', parameters)
        }
    
        if (accepts?.query) {
            parameters = buildParams(endpoint, 'query', parameters)
        }
    
        if (parameters.length) {
            result['parameters'] = parameters
        }
    
        return result
    }
    
    const buildParams = (endpoint: EndpointBase, inType: 'query' | 'path', parameters: any[]) => {
        const paramSchema = endpoint.accepts![inType]!

        const pathParams = getParamsFromPath(endpoint.path) as Record<string, boolean>

        for (const name in paramSchema.shape) {
            if (inType === 'path' && (pathParams[name] === undefined)) {
                addErrorMessage(endpoint, RouteManagerErrors.PathMissingParameter(endpoint.path, name), 'error')
                if (config.failOnError) {
                    throwLastError()
                }
            }

            pathParams[name] = true
            const required = paramSchema.shape[name].isOptional() === false
            const item = {
                in: inType,
                name,
                required,

            }
            parameters.push(schemaProcessor.processParameter(item, paramSchema.shape[name]))
        }

        const falseRemainder = Object.entries(pathParams)
        .filter(([key, value]) => value === false)
        .map(([key]) => key);

        if (inType == 'path' && (falseRemainder.length)) {
            for (const name of falseRemainder) {
                addErrorMessage(endpoint, RouteManagerErrors.ParameterInPathNotDeclared(endpoint.path, name), 'error')
                if (config.failOnError) {
                    throwLastError()
                }
            }
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
                addErrorMessage(endpoint, RouteManagerErrors.ResponseDescriptionMissing(statusCode), 'error')
                if (config.failOnError) {
                    throwLastError()
                }
            }
            const responseItem = (returns as any)[statusCode]
            const schema = schemaProcessor.processSchema(responseItem)
            responses[statusCode] = {
                ...buildContent(schema, annotation)
            }
        }
        return {
            responses
        }
    }
    
    const newSpecFile = (endpointGroupList: any, documentAnnotations: any) => {
        apiPaths = {}
        errors = []

        for (const operationId in endpointGroupList) {
            const endpoint = endpointGroupList[operationId]
            buildEndpointBody(endpoint, documentAnnotations)
        }

        return {
            ...schemaProcessor.getComponents(),
            paths: {
                ...apiPaths
            }
        }
    }

    const buildEndpointBody = (endpoint: EndpointBase, allAnnotations?: any) => {
        const annotations = allAnnotations?.operations?.[endpoint.operationId] ?? {}
        const accepts = processAccepts(endpoint, annotations?.requestBody)
        const returns = processReturns(endpoint, annotations?.responses)
    
        const pathAnnotation = allAnnotations?.paths?.[endpoint.path] ?? {}
        if (!apiPaths[endpoint.path]) {
            apiPaths[endpoint.path] = {
                ...pathAnnotation,
            }
        }
    
        if (!apiPaths[endpoint.path][endpoint.method]) {
            apiPaths[endpoint.path][endpoint.method] = {}
        }

        const operationMeta = annotations?.operation ?? {}
    
        apiPaths[endpoint.path][endpoint.method] = {
            ...apiPaths[endpoint.path][endpoint.method],
            ...{
                ...operationMeta,
                operationId: endpoint.operationId,
                ...accepts,
                ...returns
            }
        }

        if (errors.length && config.failOnError === false) {
            console.log(errors)
            console.log(RouteManagerErrors.ErrorFooter)
        }
    }

    const getErrors = () => {
        return errors
    }

    return {
        buildEndpointBody,
        newSpecFile,
        getErrors,
        buildParams
    }
}