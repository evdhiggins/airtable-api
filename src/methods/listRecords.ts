import IRequestCredentials from '../types/IRequestCredentials'
import { Record, HttpMethod } from '../types'
import { IListResults } from '../types/IListResults'
import { makeApiRequest } from '../util'

export const listRecords = (credentials: IRequestCredentials) =>
    async function<T extends Record = any>(
        filterStringOrFilters: string | IFilter = {},
    ): Promise<IListResults<T>> {
        const query: IFilter =
            typeof filterStringOrFilters === 'string'
                ? { filterByFormula: filterStringOrFilters }
                : filterStringOrFilters

        const results = await makeApiRequest({ method: HttpMethod.Get, credentials, query })

        const records: T[] = results.records
        const offset = results.offset
        const nextPage = offset
            ? listRecords(credentials).bind(null, { ...query, offset })
            : undefined

        return { records, offset, nextPage }
    }
