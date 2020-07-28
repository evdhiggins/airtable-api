import {
    RecordItem,
    HttpMethod,
    IAirtableApi,
    RequestCredentials,
    Filter,
    ListResults,
    JsonType,
    MethodThrottleArg,
} from '../types'
import { makeApiRequest, parseThrottleArg } from '../util'

export const listRecords = <T extends RecordItem>(
    credentials: RequestCredentials,
    throttleArg?: MethodThrottleArg,
): IAirtableApi<T>['listRecords'] => {
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
        })) as { records: T[]; offset?: string }

        const records: T[] = results.records
        const offset = results.offset
        const nextPage = offset ? listRecords(credentials).bind(null, { ...query, offset }) : undefined

        return { records, offset, nextPage }
    }
}
