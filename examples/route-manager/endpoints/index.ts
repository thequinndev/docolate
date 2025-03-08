import { makeEndpoint, endpointGroup } from '@thequinndev/route-manager/endpoint'
import { z } from 'zod'

const errorSchema = z.object({
    code: z.string(),
    message: z.string(),
})

const apiDocumentationSchema = z.object({
    apiVersion: z.string(),
    apiStatus: z.enum(['active', 'deprecated', 'inactive']),
    apiDocumentation: z.string().url(),
})

const getApiDocumentation = makeEndpoint({
    operationId: 'getApiDocumentation',
    path: '/',
    method: 'get',
    returns: {
        200: apiDocumentationSchema,
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: z.literal('Internal Server Error')
    }
})

const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
})

const getUserById = makeEndpoint({
    operationId: 'getUserById',
    path: '/users/{userId}',
    method: 'get',
    accepts: {
        path: z.object({
            userId: userSchema.shape.id
        })
    },
    returns: {
        200: userSchema,
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: z.literal('Internal Server Error')
    }
})

const searchUsers = makeEndpoint({
    operationId: 'searchUsers',
    path: '/users',
    method: 'get',
    accepts: {
        query: z.object({
            name: userSchema.shape.name,
            description: userSchema.shape.description
        }).partial(),
    },
    returns: {
        200: userSchema.array(),
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: z.literal('Internal Server Error')
    }
})

const createUser = makeEndpoint({
    operationId: 'createUser',
    path: '/users',
    method: 'post',
    accepts: {
        body: userSchema.omit({id: true})
    },
    returns: {
        200: userSchema,
        400: errorSchema.array(),
        404: errorSchema.array(),
        500: z.literal('Internal Server Error')
    }
})

const updateUser = makeEndpoint({
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
        500: z.literal('Internal Server Error')
    }
})

export const apiDocumentationEndpoints = endpointGroup([
    getApiDocumentation
])

export const userEndpoints = endpointGroup([
    getUserById,
    searchUsers,
    createUser,
    updateUser
])