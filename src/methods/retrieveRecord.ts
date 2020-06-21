import { RecordItem, HttpMethod, IAirtableApi, IRequestCredentials, Errors, MethodThrottleArg } from '../types'
import { makeApiRequest, HttpError } from '../util'
import { parseThrottleArg } from '../util/throttle'

export const retrieveRecord = (
    credentials: IRequestCredentials,
    throttleArg?: MethodThrottleArg,
): IAirtableApi['retrieveRecord'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function <T extends RecordItem>(recordId: string): Promise<T | null> {
        try {
            return throttle(makeApiRequest, { method: HttpMethod.Get, credentials, recordId }) as Promise<T>
        } catch (err) {
            if (err instanceof HttpError && err.statusCode === Errors.NotFound) {
                return null
            }
            throw err
        }
    }
}
