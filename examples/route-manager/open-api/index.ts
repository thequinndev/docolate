import { OpenAPIManager } from '@thequinndev/route-manager/open-api'
import { apiDocumentationEndpoints, userEndpoints } from '../endpoints'
import { writeFileSync } from 'fs';

const document = OpenAPIManager({
    version: '3.0',
    // Only these fields are required, the rest are optional
    // paths and components are omitted because they are built for you
    specFile: {
        openapi: '3.0.0',
        info: {
            title: 'OpenAPIManager Example',
            version: '1.0.0'
        }
    }
});

document.addEndpointGroup(apiDocumentationEndpoints)
.withAnnotation('getApiDocumentation', {
    path: {
        description: 'The API Documentation'
    }
})
.addEndpointGroup(userEndpoints)
.withAnnotation('createUser', {
    path: {
        description: 'Create a new user'
    },
    requestBody: {
        example: {
            name: 'John Smith',
            description: 'A new user'
        }
        
    }
})
.withAnnotation('getUserById', {
    path: {
        description: 'Get a user by their User ID'
    }
})
.withAnnotation('searchUsers', {
    path: {
        description: 'Search for users by their name or description'
    }
})
.withAnnotation('updateUser', {
    path: {
        description: 'Update a user by their User ID'
    }
})

const apiSpec = document.build()
writeFileSync(__dirname + '/openapi.json', JSON.stringify(apiSpec, null, 2))
