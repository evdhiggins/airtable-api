import {
    RecordItem,
    HttpMethod,
    IAirtableApi,
    IRequestCredentials,
    IFilter,
    IListResults,
} from '../types'
import { makeApiRequest } from '../util'

export const listRecords = (credentials: IRequestCredentials): IAirtableApi['listRecords'] =>
    async function<T extends RecordItem = any>(
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
