import { RecordItem, HttpMethod, Record, IAirtableApi, RequestCredentials, MethodThrottleArg } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody, parseThrottleArg } from '../util'

export const createRecords = <T extends RecordItem>(
    credentials: RequestCredentials,
    throttleArg?: MethodThrottleArg,
): IAirtableApi<T>['createRecords'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (record: T | T[], typecast?: boolean): Promise<any> {
        const { isMany, recordSets } = prepareWriteRecords(record)

        const promises = recordSets.map((set) => {
            const body = makeWriteBody(set, typecast)

            return throttle(makeApiRequest, {
                method: HttpMethod.Post,
                credentials,
                body,
            }) as Promise<Array<Record<T>>>
        })

        const results = (await Promise.all(promises)).flat()

        if (isMany) {
            return results
        }
        return results[0]
    }
}
