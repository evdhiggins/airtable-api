import IRequestCredentials from '../types/IRequestCredentials'
import { Record, HttpMethod, IRecord } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'

type UpdateRecord<T> = {
    recordId: string
    fields: T
}

export const updateRecordsFactory = (replaceExistingRecords: boolean) => (
    credentials: IRequestCredentials,
) => {
    function update<T extends Record = any>(
        record: UpdateRecord<T>,
        typecast?: boolean,
    ): Promise<IRecord<T>>
    function update<T extends Record = any>(
        records: Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
    async function update<T extends Record = any>(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<IRecord<T> | Array<IRecord<T>>> {
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
    return update
}
