import { ParameterStrategy, QueryManager } from '@thequinndev/db-manager/query-manager'
import { mockArrayClient } from '@thequinndev/db-manager/testing'
import { userQueries } from '../query/index'

const manager = QueryManager({
    paramaterStrategy: ParameterStrategy.Dollar,
    client: mockArrayClient({
        example: [
            {
                markedBy: ['example'],
                returns: 'example'
            }
        ]
    }),
    queries: userQueries
})

manager.run('createUser', {
    description: 'A new user',
    name: 'New Name'
})