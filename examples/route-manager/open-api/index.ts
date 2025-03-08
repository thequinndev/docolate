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
    },
    defaultMetadata: {
        responses: {
            400: {
                description: 'Bad request'
            },
            404: {
                description: 'Resource not found'
            },
            500: {
                description: 'Internal server error'
            }
        }
    }
});

document.addEndpointGroup(apiDocumentationEndpoints)
.withAnnotation('getApiDocumentation', {
    path: {
        description: 'The API Documentation'
    },
    responses: {
        200: {
            description: 'Current API metadata for this version'
        },
    }
})
.addEndpointGroup(userEndpoints)
.withAnnotation('createUser', {
    path: {
        description: 'Create a new user'
    },
    responses: {
        200: {
            description: 'Successfully created the user'
        },
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
    },
    responses: {
        200: {
            description: 'Successfully retrieved the user'
        },
    }
})
.withAnnotation('searchUsers', {
    path: {
        description: 'Search for users by their name or description'
    },
    responses: {
        200: {
            description: 'Successfully retrieved a list of users'
        },
    }
})
.withAnnotation('updateUser', {
    path: {
        description: 'Update a user by their User ID'
    },
    responses: {
        200: {
            description: 'Successfully updated the user'
        },
    }
})

const apiSpec = document.build({
    failOnError: true,
})
writeFileSync(__dirname + '/openapi.json', JSON.stringify(apiSpec, null, 2))
