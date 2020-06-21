import { RecordItem, HttpMethod, IRecord, UpdateRecord, IRequestCredentials } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'

export const updateRecordsFactory = (replaceExistingRecords: boolean) => (credentials: IRequestCredentials) =>
    async function <T extends RecordItem>(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        const { recordSets, isMany } = prepareWriteRecords(recordOrRecords)

        const promises = recordSets.map((set) => {
            const body = makeWriteBody(set, typecast)

            return makeApiRequest<Array<IRecord<T>>>({
                method: replaceExistingRecords ? HttpMethod.Put : HttpMethod.Patch,
                credentials,
                body,
            })
        })

        const results = (await Promise.all(promises)).flat()

        if (isMany) {
            return results
        }
        return results[0]
    }
