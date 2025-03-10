import { OpenAPIManager } from '@thequinndev/route-manager/openapi/manager'
import { apiDocumentationEndpoints, userEndpoints } from '../../endpoints'


const missingDocs = OpenAPIManager({
    version: '3.0',
});

missingDocs.addEndpointGroup(apiDocumentationEndpoints)

const apiDocumentationDocument = OpenAPIManager({
    version: '3.0',
    // Only these fields are required, the rest are optional
    // paths and components are omitted because they are built for you
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

apiDocumentationDocument.addEndpointGroup(apiDocumentationEndpoints, {
    operations: {
        'getApiDocumentation': {
            operation: {
                description: 'The API Documentation'
            },
            responses: {
                200: {
                    description: 'Current API metadata for this version'
                },
            }
        }
    }
})


const apiUserDocument = OpenAPIManager({
    version: '3.0',
    // Only these fields are required, the rest are optional
    // paths and components are omitted because they are built for you
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

apiUserDocument.addEndpointGroup(userEndpoints, {
    operations: {
        'createUser': {
            operation: {
                description: 'Create a new user'
            },
            responses: {
                200: {
                    description: 'Successfully created the user',
                    example: {
                        id: 1,
                        name: 'John Smith',
                        description: 'A new user'
                    }
                },
            },
            requestBody: {
                example: {
                    name: 'John Smith',
                    description: 'A new user'
                }
    
            }
        },
        'getUserById': {
            operation: {
                description: 'Get a user by their User ID'
            },
            responses: {
                200: {
                    description: 'Successfully retrieved the user'
                },
            }
        },
        'searchUsers': {
            operation: {
                description: 'Search for users by their name or description'
            },
            responses: {
                200: {
                    description: 'Successfully retrieved a list of users'
                },
            }
        },
        'updateUser': {
            operation: {
                description: 'Update a user by their User ID'
            },
            responses: {
                200: {
                    description: 'Successfully updated the user'
                },
            }
        }
    }
})


export const ApiDocumentExample = apiDocumentationDocument
export const UserDocumentExample = apiUserDocument
export const MissingDocsExample = missingDocs
