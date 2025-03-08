import { makeEndpoint, endpointGroup } from '@thequinndev/route-manager/endpoint'
import { z } from 'zod'

const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
})

const errorSchema = z.object({
    code: z.string(),
    message: z.string(),
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

export const userEndpoints = endpointGroup([
    getUserById
])