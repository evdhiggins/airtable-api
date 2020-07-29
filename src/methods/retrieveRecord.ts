import {
    RecordItem,
    HttpMethod,
    IAirtableApi,
    RequestCredentials,
    Errors,
    MethodThrottleArg,
    AirtableRecord,
} from '../types'
import { makeApiRequest, HttpError, parseThrottleArg } from '../util'

export const retrieveRecord = <T extends RecordItem>(
    credentials: RequestCredentials,
    throttleArg?: MethodThrottleArg,
): IAirtableApi<T>['retrieveRecord'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function (recordId: string): Promise<AirtableRecord<T> | null> {
        try {
            return throttle(makeApiRequest, { method: HttpMethod.Get, credentials, recordId }) as Promise<
                AirtableRecord<T>
            >
        } catch (err) {
            if (err instanceof HttpError && err.statusCode === Errors.NotFound) {
                return null
            }
            throw err
        }
    }
}
