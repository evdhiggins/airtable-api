import IRequestCredentials from '../types/IRequestCredentials'
import { RecordItem, HttpMethod, IRecord, UpdateRecord } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'

export const updateRecordsFactory = (replaceExistingRecords: boolean) => (
    credentials: IRequestCredentials,
) =>
    async function<T extends RecordItem = any>(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<any> {
        const { records, isMany } = prepareWriteRecords(recordOrRecords)

        const body = makeWriteBody(records, typecast)

        const results = await makeApiRequest<Array<IRecord<T>>>({
            method: replaceExistingRecords ? HttpMethod.Put : HttpMethod.Patch,
            credentials,
            body,
        })

        if (isMany) {
            return results
        }
        return results[0]
    }
