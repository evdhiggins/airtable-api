import {
    RecordItem,
    HttpMethod,
    ITableConnection,
    TableConnectionCredentials,
    HttpErrorStatus,
    MethodThrottleArg,
    AirtableRecord,
} from '../types'
import { makeApiRequest, HttpError, parseThrottleArg } from '../util'

export const retrieveRecord = <T extends RecordItem>(
    credentials: TableConnectionCredentials,
    throttleArg?: MethodThrottleArg,
): ITableConnection<T>['retrieveRecord'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function (recordId: string): Promise<AirtableRecord<T> | null> {
        try {
            return throttle(makeApiRequest, { method: HttpMethod.Get, credentials, recordId }) as Promise<
                AirtableRecord<T>
            >
        } catch (err) {
            if (err instanceof HttpError && err.statusCode === HttpErrorStatus.NotFound) {
                return null
            }
            throw err
        }
    }
}
