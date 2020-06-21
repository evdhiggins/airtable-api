import { RecordItem, HttpMethod, IAirtableApi, IRequestCredentials, IFilter, IListResults, JsonType } from '../types'
import { makeApiRequest } from '../util'

export const listRecords = (credentials: IRequestCredentials): IAirtableApi['listRecords'] =>
    async function <T extends RecordItem>(filterStringOrFilters: string | IFilter = {}): Promise<IListResults<T>> {
        const query: IFilter =
            typeof filterStringOrFilters === 'string'
                ? { filterByFormula: filterStringOrFilters }
                : filterStringOrFilters

        const results = await makeApiRequest<{ records: T[]; offset?: string }>({
            method: HttpMethod.Get,
            credentials,
            query: query as Record<string, JsonType>,
        })

        const records: T[] = results.records
        const offset = results.offset
        const nextPage = offset ? listRecords(credentials).bind(null, { ...query, offset }) : undefined

        return { records, offset, nextPage }
    }
