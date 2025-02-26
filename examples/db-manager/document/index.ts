import { DocumentManager, ParameterStrategy } from "@thequinndev/db-manager/document"
import { writeFileSync } from "fs"
import { userQueries } from "../query"

const document = DocumentManager({
    paramaterStrategy: ParameterStrategy.Dollar,
    queries: userQueries
})

document.annotate('getAllUsers', {
    title: 'Get all current users',
    returnExample: [{
        id: 1234,
        name: 'Richard Sanders',
        description: 'A valuable user.',
        date: '01/01/1970'
    },
    {
        id: 1235,
        name: 'Karen Sanders',
        description: 'A valuable user.',
        date: '01/01/1970'
    }]
})

document.annotate('getUserById', {
    title: 'Select user by ID',
    parameterExample: {
        id: 1234
    },
    returnExample: {
        id: 1234,
        name: 'Richard Sanders',
        description: 'A valuable user.',
        date: '01/01/1970'
    }
})

document.annotate('getUserNameAndDateById', {
    title: 'Select only user name and date by ID',
    parameterExample: {
        id: 1234
    },
    returnExample: {
        name: 'Richard Sanders',
        date: '01/01/1970'
    }
})

document.annotate('createUser', {
    title: 'Create a new user',
    parameterExample: {
        name: 'Richard Sanders',
        description: 'A valuable user.'
    },
    returnExample: {
        id: 1234,
        name: 'Richard Sanders',
        description: 'A valuable user.',
        date: '01/01/1970'
    }
})

const doc = document.compile()

writeFileSync(__dirname + '/doc.example.md', doc)