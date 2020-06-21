import {
    RecordItem,
    HttpMethod,
    IAirtableApi,
    IRequestCredentials,
    IFilter,
    IListResults,
    JsonType,
    MethodThrottleArg,
} from '../types'
import { makeApiRequest } from '../util'
import { parseThrottleArg } from '../util/throttle'

export const listRecords = (
    credentials: IRequestCredentials,
    throttleArg?: MethodThrottleArg,
): IAirtableApi['listRecords'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function <T extends RecordItem>(
        filterStringOrFilters: string | IFilter = {},
    ): Promise<IListResults<T>> {
        const query: IFilter =
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
