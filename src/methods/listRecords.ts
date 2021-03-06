import {
    RecordItem,
    HttpMethod,
    ITableConnection,
    TableConnectionCredentials,
    Filter,
    ListResults,
    AirtableRecord,
    JsonType,
    MethodThrottleArg,
} from '../types'
import { makeApiRequest, parseThrottleArg } from '../util'

export const listRecords = <T extends RecordItem>(
    credentials: TableConnectionCredentials,
    throttleArg?: MethodThrottleArg,
): ITableConnection<T>['listRecords'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function (filterStringOrFilters: string | Filter = {}): Promise<ListResults<T>> {
        const query: Filter =
            typeof filterStringOrFilters === 'string'
                ? { filterByFormula: filterStringOrFilters }
                : filterStringOrFilters

        const results = (await throttle(makeApiRequest, {
            method: HttpMethod.Get,
            credentials,
            query: query as Record<string, JsonType>,
        })) as { records: AirtableRecord<T>[]; offset?: string }

        const records: AirtableRecord<T>[] = results.records
        const offset = results.offset
        const nextPage = offset ? listRecords(credentials).bind(null, { ...query, offset }) : undefined

        return { records, offset, nextPage }
    }
}
