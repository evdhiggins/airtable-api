import { HttpMethod, DeletedRecord, IRequestCredentials, MethodThrottleArg } from '../types'
import { makeApiRequest, prepareWriteRecords, parseThrottleArg } from '../util'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteRecords = (credentials: IRequestCredentials, throttleArg?: MethodThrottleArg) => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (ids: string | string[]): Promise<any> {
        const { isMany, recordSets: idSets } = prepareWriteRecords(ids)

        const promises = idSets.map((set) => {
            const query = { records: set }
            return throttle(makeApiRequest, {
                method: HttpMethod.Delete,
                credentials,
                query,
            }) as Promise<{ records: DeletedRecord[] }>
        })

        const results = (await Promise.all(promises)).reduce((acc, deletedRecord) => {
            return { records: [...acc.records, ...deletedRecord.records] }
        })

        if (isMany) {
            return results.records
        }
        return results.records[0]
    }
}
