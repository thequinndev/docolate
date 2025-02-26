import { BaseQueryItem } from './query.types'

export interface ClientInterface {
    beginTransaction: () => void
    rollbackTransaction: () => void
    commitTransaction: () => void
    queryRun: (queryItem: BaseQueryItem, parameters?: any) => Promise<any>
}