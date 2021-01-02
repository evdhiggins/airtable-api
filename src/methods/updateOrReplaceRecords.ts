import { RecordItem, HttpMethod, AirtableRecord, RecordToUpdate, TableConnectionCredentials, IThrottle } from '../types'
import { UpdatedRecord } from '../types/recordTypes'
import { makeApiRequest, prepareWriteRecords, makeWriteBody, HttpError } from '../util'

export async function updateOrReplaceRecords<T extends RecordItem>(
    credentials: TableConnectionCredentials,
    throttle: IThrottle,
    replaceExistingRecords: boolean,
    recordOrRecords: RecordToUpdate<Partial<T>> | Array<RecordToUpdate<Partial<T>>>,
    typecast?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    const { recordSets, isMany } = prepareWriteRecords(recordOrRecords)

    const promises = recordSets.map(
        async (records): Promise<UpdatedRecord<T>[]> => {
            // invalid records that have been identified by extracting the record ID from returned error messages
            const recordsToReturn = [] as UpdatedRecord<T>[]

            while (records.length) {
                try {
                    // prepare values for http request
                    const body = makeWriteBody(records, typecast)

                    // receive updated records
                    const updatedRecords = (await throttle(makeApiRequest, {
                        method: replaceExistingRecords ? HttpMethod.Put : HttpMethod.Patch,
                        credentials,
                        body,
                    })) as { records: AirtableRecord<T>[] }

                    // return updated records & error records
                    return [
                        ...updatedRecords.records.map(
                            (r) =>
                                ({
                                    ...r,
                                    wasUpdated: true,
                                } as UpdatedRecord<T>),
                        ),
                        ...recordsToReturn,
                    ]
                } catch (err) {
                    //  If possible, we'll try to identify an offending row and flag it as invalid.

                    // When a single row is invalid, no rows in a write batch are able to complete,
                    // so we'll keep retrying until we succeed or until all rows have been identified
                    // as having errors.

                    const invalidRecordRegex = /^Record ID (.+) does not exist in this table$/
                    if (err instanceof HttpError && invalidRecordRegex.test(err.message)) {
                        const invalidRecordId = err.message.replace(invalidRecordRegex, '$1')

                        /** All records with an id that matches the error-inducing recordId */
                        const errorRecords = [] as RecordToUpdate<Partial<T>>[]
                        /** All records with an id that DOES NOT match the error recordId */
                        const okRecords = [] as RecordToUpdate<Partial<T>>[]

                        for (const record of records) {
                            if (record.id === invalidRecordId) {
                                errorRecords.push(record)
                            } else {
                                okRecords.push(record)
                            }
                        }

                        if (errorRecords.length) {
                            records = okRecords
                            recordsToReturn.push(
                                ...errorRecords.map(
                                    (r) =>
                                        ({
                                            id: r.id,
                                            wasUpdated: false,
                                            errorMessage: err.message,
                                            fields: r.fields,
                                        } as UpdatedRecord<T>),
                                ),
                            )
                            continue
                        }
                        // if the missing record can't be found, propagate the error
                    }
                    throw err
                }
            }
            return recordsToReturn
        },
    )

    const results = (await Promise.all(promises)).flat()

    if (isMany) {
        return results
    }
    return results[0]?.wasUpdated ? results[0] : null
}
