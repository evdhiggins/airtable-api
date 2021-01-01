import { HttpMethod, DeletedRecord, RequestCredentials, MethodThrottleArg } from '../types'
import { makeApiRequest, prepareWriteRecords, parseThrottleArg, HttpError } from '../util'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteRecords = (credentials: RequestCredentials, throttleArg?: MethodThrottleArg) => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (ids: string | string[]): Promise<any> {
        const { isMany, recordSets: idSets } = prepareWriteRecords(ids)

        const promises = idSets.map(
            async (ids): Promise<DeletedRecord[]> => {
                const errorRecordsToReturn = [] as DeletedRecord[]
                while (ids.length) {
                    try {
                        const query = { records: ids }
                        const deletedRecords = (await throttle(makeApiRequest, {
                            method: HttpMethod.Delete,
                            credentials,
                            query,
                        })) as { records: { id: string; deleted: boolean }[] }
                        return [
                            ...errorRecordsToReturn,
                            ...deletedRecords.records.map((r) => ({ wasDeleted: r.deleted, id: r.id })),
                        ]
                    } catch (err) {
                        //  If possible, we'll try to identify an offending row and flag it as invalid.

                        // When a single row is invalid, no rows in a write batch are able to complete,
                        // so we'll keep retrying until we succeed or until all rows have been identified
                        // as having errors.

                        const invalidRecordRegex = /^Could not find a record with ID "(.+)"\.$/
                        if (err instanceof HttpError && invalidRecordRegex.test(err.message)) {
                            const invalidRecordId = err.message.replace(invalidRecordRegex, '$1')

                            /** All records with an id that matches the error-inducing recordId */
                            const errorIds = [] as string[]
                            /** All records with an id that DOES NOT match the error recordId */
                            const okIds = [] as string[]

                            for (const id of ids) {
                                if (id === invalidRecordId) {
                                    errorIds.push(id)
                                } else {
                                    okIds.push(id)
                                }
                            }

                            if (errorIds.length) {
                                ids = okIds
                                errorRecordsToReturn.push(...errorIds.map((id) => ({ id, wasDeleted: false })))
                                continue
                            }
                            // if the missing record can't be found, propagate the error
                        }
                        throw err
                    }
                }
                return errorRecordsToReturn
            },
        )

        const results = (await Promise.all(promises)).flat()

        if (isMany) {
            return results
        }
        return results[0]?.wasDeleted ? results[0] : null
    }
}
