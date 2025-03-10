import { ComponentFactory } from '@thequinndev/route-manager/component-factory'
import { RouteManager } from '@thequinndev/route-manager/endpoint'
import { z } from 'zod'

const routeManager = RouteManager()

const componentFactory = ComponentFactory({
    schemas: [
        'Error',
        'ApiDocumentation',
        'UserGet',
        'UserCreate'
    ],
    parameters: [
        'PathUserId',
        'QueryUserName'
    ]
})

const errorSchema = componentFactory.makeSchema(z.object({
    code: z.string(),
    message: z.string(),
}), 'Error')

const error500 = z.enum(['Internal Server Error'])

const apiDocumentationSchema = componentFactory.makeSchema(z.object({
    apiVersion: z.string(),
    apiStatus: z.enum(['active', 'deprecated', 'inactive']),
    apiDocumentation: z.string().url(),
}), 'ApiDocumentation')

const getApiDocumentation = routeManager.endpoint({
    operationId: 'getApiDocumentation',
    path: '/',
    method: 'get',
    returns: {
        200: apiDocumentationSchema,
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: error500
    }
})

const userSchema = componentFactory.makeSchema(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
}), 'UserGet')


const userIdParameter = componentFactory.makeParameterItem(userSchema.shape.id, 'PathUserId')

const getUserById = routeManager.endpoint({
    operationId: 'getUserById',
    path: '/users/{userId}',
    method: 'get',
    accepts: {
        path: z.object({
            userId: userIdParameter
        })
    },
    returns: {
        200: userSchema,
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: error500
    }
})

const nameParameter = componentFactory.makeParameterItem(userSchema.shape.name, 'QueryUserName')

const searchUsers = routeManager.endpoint({
    operationId: 'searchUsers',
    path: '/users',
    method: 'get',
    accepts: {
        query: z.object({
            name: nameParameter,
            description: userSchema.shape.description
        }).partial(),
    },
    returns: {
        200: userSchema.array(),
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: error500
    }
})

const createUser = routeManager.endpoint({
    operationId: 'createUser',
    path: '/users',
    method: 'post',
    accepts: {
        body: componentFactory.makeSchema(userSchema.omit({id: true}), 'UserCreate')
    },
    returns: {
        200: userSchema,
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: error500
    }
})

const updateUser = routeManager.endpoint({
    operationId: 'updateUser',
    path: '/users/{userId}',
    method: 'put',
    accepts: {
        path: z.object({
            userId: userSchema.shape.id
        }),
        body: userSchema
    },
    returns: {
        200: userSchema,
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: error500
    }
})

export const apiDocumentationEndpoints = routeManager.endpointGroup([
    getApiDocumentation
])

export const userEndpoints = routeManager.endpointGroup([
    getUserById,
    searchUsers,
    createUser,
    updateUser
])