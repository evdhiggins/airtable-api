import { RecordItem, HttpMethod, AirtableRecord, IAirtableApi, RequestCredentials, MethodThrottleArg } from '../types'
import { CreatedRecord } from '../types/recordTypes'
import { makeApiRequest, prepareWriteRecords, makeWriteBody, parseThrottleArg } from '../util'

export const createRecords = <T extends RecordItem>(
    credentials: RequestCredentials,
    throttleArg?: MethodThrottleArg,
): IAirtableApi<T>['createRecords'] => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (record: T | T[], typecast?: boolean): Promise<any> {
        const { isMany, recordSets } = prepareWriteRecords(record)

        const promises = recordSets.map(
            async (set): Promise<CreatedRecord<T>[]> => {
                const setWithFields = set.map((fields) => ({ fields }))
                const body = makeWriteBody(setWithFields, typecast)

                const createdRecords = (await throttle(makeApiRequest, {
                    method: HttpMethod.Post,
                    credentials,
                    body,
                })) as { records: AirtableRecord<T>[] }

                return createdRecords.records.map((r) => ({ ...r, wasCreated: true }))
            },
        )

        const results = (await Promise.all(promises)).flat()

        if (isMany) {
            return results
        }
        return results[0]
    }
}
