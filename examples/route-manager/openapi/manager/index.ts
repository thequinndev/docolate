import { OpenAPIManager } from '@thequinndev/route-manager/openapi/manager'
import { apiDocumentationEndpoints, userEndpoints } from '../../endpoints'
import { metaManagerExample } from '../meta-manager';


const missingDocs = OpenAPIManager({
    version: '3.0',
});

missingDocs.addEndpointGroup(apiDocumentationEndpoints)

const apiDocumentationDocument = OpenAPIManager({
    version: '3.0',
    metaManager: metaManagerExample,
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
    paths: {
        '/': {
            description: 'API Root',
            summary: 'Base Endpoint'
        }
    },
    operations: {
        'getApiDocumentation': {
            operation: {
                description: 'The API Documentation',
                tags: [
                    'docolate',
                    'example',
                    'route-manager'
                ]
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
    paths: {
        '/users': {
            description: 'All User Operations',
            summary: 'All User Endpoints'
        },
        '/users/{userId}': {
            description: 'Specific User Operations',
            summary: 'User By ID Endpoints'
        }
    },
    operations: {
        'createUser': {
            operation: {
                description: 'Create a new user',
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
                    description: 'Successfully retrieved the user',
                    examples: {
                        valid: {
                            value: {
                                id: 123,
                                name: 'John Smith',
                                description: 'A new user'
                            }
                        }
                    }
                },
            },
            parameters: {
                path: {
                    'userId': {
                        description: 'Test',
                        example: 0,
                    }
                }
            }
        },
        'searchUsers': {
            operation: {
                description: 'Search for users by their name or description',
                deprecated: true,
            },
            responses: {
                200: {
                    description: 'Successfully retrieved a list of users'
                },
            },
            parameters: {
                'query': {
                    'description': {
                        description: 'Example'
                    },
                    name: {
                        description: 'Example'
                    }
                }
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
