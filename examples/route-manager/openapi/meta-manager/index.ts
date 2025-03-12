import { OpenAPIMetaManager } from '@thequinndev/route-manager/openapi/meta-manager'

export const metaManagerExample = OpenAPIMetaManager({
    version: '3.0',
    tags: [
        {
            name: 'example'
        },
        {
            name: 'docolate'
        },
        {
            name: 'route-manager'
        }
    ]
})