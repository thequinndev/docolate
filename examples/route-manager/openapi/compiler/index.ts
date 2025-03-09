import { OpenApiSpecCompiler } from '@thequinndev/route-manager/openapi/compiler'
import { writeFileSync } from 'fs';
import { ApiDocumentExample, UserDocumentExample } from '../manager';

const compiler = OpenApiSpecCompiler({
    version: '3.0',
    specFile: {
        openapi: '3.0.0',
        info: {
            
            title: 'OpenAPIManager Example',
            version: '1.0.0'
        }
    },
    openApiManagers: [
        ApiDocumentExample,
        UserDocumentExample
    ]
})

const apiSpec = compiler.build({
    failOnError: true,
})

writeFileSync(__dirname + '/../openapi.json', JSON.stringify(apiSpec, null, 2))
