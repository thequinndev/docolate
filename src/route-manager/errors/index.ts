export const RouteManagerErrors = {
    NoArrayRefs: [
        "This library doesn't currently support Array Schemas as components.",
        "See https://github.com/thequinndev/docolate/wiki/Docolate-%E2%80%90-OpenAPI-Manager-%E2%80%90-Handling-Components#important-note-on-arrays"
    ].join('\n'),
    ResponseDescriptionMissing: (statusCode: string) => `Description is missing for response status ${statusCode}`,
    ErrorFooter: [
        'The above errors will likely cause OpenAPI validation errors.',
        'If you want errors to prevent the build from completing, please set failOnError: true',
        'apiBuilder.build({failOnError: true})'
    ].join('\n'),
    NoArrayParameter: "You cannot make parameters from arrays",
    NoObjectParameter: "You cannot make parameters from objects",
    PathMissingParameter: (path: string, param: string) => `Path ${path} is missing parameter ${param}.`,
    ParameterInPathNotDeclared: (path: string, param: string) => `Path parameter ${param} is not declared, but exists in path ${path}.`,
    UnionTypeWarning: [
        'The RouteManager module will most likely offer minimal support for schemas resulting in oneOf or anyOf.',
        `See: https://github.com/thequinndev/docolate/wiki/Docolate-%E2%80%90-OpenAPIManager-%E2%80%90-A-note-on-union-objects-and-properties`
    ].join('\n')
}