import { ClientInterface } from "../client-interface"
import { BaseQueryItem, GetQuery, QueriesByAlias, QueryIn, QueryOut } from "../query.types"

export enum ParameterStrategy {
    Plain = 0,
    QuestionMark = 1,
    Ampersand = 2,
    Colon = 3,
    Dollar = 4,
}

export const QueryManager = <
    Queries extends QueriesByAlias<BaseQueryItem[]>
>(config: {
    paramaterStrategy: ParameterStrategy
    client: ClientInterface,
    queries: Queries
}) => {
    const beginTransaction = async () => {
        await config.client.beginTransaction()
    }

    const rollbackTransaction = async () => {
        await config.client.rollbackTransaction()
    }

    const commitTransaction = async () => {
        await config.client.commitTransaction()
    }

    const run = async <
        Alias extends keyof Queries,
        QueryItem extends GetQuery<Queries, Alias>,
        In extends QueryIn<QueryItem['parameters']>,
        Out extends QueryOut<QueryItem>
    >(alias: Alias, parameters?: In): Promise<Out> => {
        const queryItem = config.queries[alias] as QueryItem
        const result = await config.client.queryRun(queryItem, parameters as any)

        // If onResultRetrieval has been declared then call it
        if (queryItem.onResultRetrieval) {
            queryItem.onResultRetrieval(result)
        }

        // Otherwise return all rows
        return queryItem.returns.parse(result)
    }

    return {
        beginTransaction,
        rollbackTransaction,
        commitTransaction,
        run
    }
}