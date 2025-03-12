import { OpenAPISpecCompiler } from '@thequinndev/route-manager/openapi/compiler'
import { writeFileSync } from 'fs';
import { ApiDocumentExample, UserDocumentExample } from '../manager';
import { metaManagerExample } from '../meta-manager'

const compiler = OpenAPISpecCompiler({
    version: '3.0',
    specFile: {
        openapi: '3.0.0',
        info: {
            
            title: 'OpenAPIManager Example',
            version: '1.0.0'
        }
    },
    metaManager: metaManagerExample,
    openApiManagers: [
        ApiDocumentExample,
        UserDocumentExample
    ]
})

const apiSpec = compiler.build({
    failOnError: true,
})

writeFileSync(__dirname + '/../openapi.json', JSON.stringify(apiSpec, null, 2))
