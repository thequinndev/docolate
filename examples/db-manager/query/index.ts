import { z } from "zod";
import { query, queryGroup, queryParameters } from '@thequinndev/db-manager/query'

const userTableSchema = z.object({
    id: z.coerce.number().min(1).max(400000),
    name: z.string().min(1).max(50),
    description: z.string().max(1000),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
})

const userIdParam = queryParameters([{ id:  userTableSchema.shape.id }] as const)

const getAllUsers = query({
    query: 'select * from user_table',
    alias: 'getAllUsers',
    description: 'Get all users',
    returns: userTableSchema.array()
})

const getUserById = query({
    query: 'select * from user_table where id = $1',
    alias: 'getUserById',
    description: 'Get all columns by ID',
    parameters: userIdParam,
    returns: userTableSchema
})

const getUserNameAndDateById = query({
    query: 'select name, date from user_table where id = $1',
    alias: 'getUserNameAndDateById',
    description: 'Get just name and date by ID',
    parameters: userIdParam,
    returns: userTableSchema.pick({name: true, date: true})
})

const createUser = query({
    query: 'select * from create_user($1, $2)',
    alias: 'createUser',
    description: 'Create a user',
    parameters: queryParameters([
        {
            name: userTableSchema.shape.name
        },
        {
            description: userTableSchema.shape.description
        }
    ] as const),
    returns: userTableSchema
})

export const userQueries = queryGroup([
    getAllUsers,
    getUserById,
    getUserNameAndDateById,
    createUser
])