import { z } from "zod";
import { query, queryGroup, queryParameter } from '@thequinndev/db-manager/query'

const userTableSchema = z.object({
    id: z.coerce.number().min(1).max(400000),
    name: z.string().min(1).max(50),
    description: z.string().max(1000),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
})

const userId = queryParameter('id', userTableSchema.shape.id)

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
    parameters: [userId],
    returns: userTableSchema
})

const getUserNameAndDateById = query({
    query: 'select name, date from user_table where id = $1',
    alias: 'getUserNameAndDateById',
    description: 'Get just name and date by ID',
    parameters: [userId],
    returns: userTableSchema.pick({name: true, date: true})
})

const createUser = query({
    query: 'select * from create_user($1, $2)',
    alias: 'createUser',
    description: 'Create a user',
    parameters: [
        queryParameter('name', userTableSchema.shape.name),
        queryParameter('description', userTableSchema.shape.description),
    ],
    returns: userTableSchema
})

export const userQueries = queryGroup([
    getAllUsers,
    getUserById,
    getUserNameAndDateById,
    createUser
])