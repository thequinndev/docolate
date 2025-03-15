import { EndpointBase } from "../endpoint";
import { SchemaProcessor } from "../schema-process";
import { RouteManagerErrors } from "../errors";
import { getParamsFromPath } from "../path-param-get";
import { OASVersions } from "../openapi";

export type Error = {
    path: string,
    operationId: string,
    method: string,
    message: string,
    severity: 'warning' | 'error'
}

export const apiBuilder = (config: {
    version: OASVersions,
    failOnError: boolean,
    defaultMetadata: any
}) => {

    let errors: Error[] = []
    let apiPaths: any = {}

    const schemaProcessor = SchemaProcessor(config.version)

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

    const checkForUnionWarnings = (endpoint: EndpointBase, schema: any) => {
        if (schema.oneOf || schema.anyOf) {
            addErrorMessage(endpoint, RouteManagerErrors.UnionTypeWarning, 'warning')
        }
    }

    const processAccepts = (endpoint: EndpointBase, annotationsRequestBody?: any, annotationsParams?: any) => {
        const result = {} as any
        let parameters = [] as any[]
        const accepts = endpoint.accepts
        if (accepts?.body) {
            const schema = schemaProcessor.processSchema(accepts.body)
            checkForUnionWarnings(endpoint, schema)
            annotationsRequestBody = annotationsRequestBody ?? {}
            result['requestBody'] = {
                ...buildContent(schema, annotationsRequestBody)
            }
        }
    
        if (accepts?.path) {
            const annotations = annotationsParams?.path ?? {}
            parameters = buildParams(endpoint, 'path', parameters, annotations)
        }
    
        if (accepts?.query) {
            const annotations = annotationsParams?.query ?? {}
            parameters = buildParams(endpoint, 'query', parameters, annotations)
        }
    
        if (parameters.length) {
            result['parameters'] = parameters
        }
    
        return result
    }
    
    const buildParams = (endpoint: EndpointBase, inType: 'query' | 'path', parameters: any[], annotations?: any) => {
        const paramSchema = endpoint.accepts![inType]!

        const pathParams = getParamsFromPath(endpoint.path) as Record<string, boolean>

        for (const name in paramSchema.shape) {
            const paramAnnotation = (annotations?.[name]) ?? {}

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
                ...paramAnnotation
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
            checkForUnionWarnings(endpoint, schema)
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
        const accepts = processAccepts(endpoint, annotations?.requestBody, annotations?.parameters)
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