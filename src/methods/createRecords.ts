import { RecordItem, HttpMethod, IRecord, IAirtableApi, IRequestCredentials, MethodThrottleArg } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'
import { parseThrottleArg } from '../util/throttle'

export const createRecords = (
    credentials: IRequestCredentials,
    throttleArg?: MethodThrottleArg,
): IAirtableApi['createRecords'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function <T extends RecordItem>(record: T | T[], typecast?: boolean): Promise<any> {
        const { isMany, recordSets } = prepareWriteRecords(record)

        const promises = recordSets.map((set) => {
            const body = makeWriteBody(set, typecast)

            return throttle(makeApiRequest, {
                method: HttpMethod.Post,
                credentials,
                body,
            }) as Promise<Array<IRecord<T>>>
        })

        const results = (await Promise.all(promises)).flat()

        if (isMany) {
            return results
        }
        return results[0]
    }
}
