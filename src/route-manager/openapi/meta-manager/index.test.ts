import { OpenAPIMetaManager } from ".";
import { apiDocumentationEndpoints } from "../../../../examples/route-manager/endpoints"
import { OpenAPIManager } from '../manager'

describe("OpenAPIMetaManager", () => {
    it("Will make operations extensible in the OpenAPIManager", () => {
        const metaManager = OpenAPIMetaManager({
            version: '3.0',
            customOperationMeta: [
                'my-extra-key',
                'any-key'
            ]
            
        })

        const apiManager = OpenAPIManager({
            version: '3.0',
            metaManager: metaManager
        })
        apiManager.addEndpointGroup(apiDocumentationEndpoints, {
            'operations': {
                'getApiDocumentation': {
                    // The main test here is just that we don't get compiler errors when the extra keys are included
                    'operation': {
                        'description': 'Test',
                        // These should have no compiler errors
                        'my-extra-key': 'MyKey1',
                        'any-key': 'MyKey2',
                    }
                }
            }
        })

        const operation = apiManager.build({failOnError: false}).spec.paths['/'].get

        expect(operation['my-extra-key']).toEqual('MyKey1')
        expect(operation['any-key']).toEqual('MyKey2')
    })
});
