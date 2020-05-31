import IRequestCredentials from '../types/IRequestCredentials'
import { Record, HttpMethod, IRecord } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'

export const createRecords = (credentials: IRequestCredentials) => {
    function create<T extends Record = any>(record: T, typecast?: boolean): Promise<IRecord<T>>
    function create<T extends Record = any>(
        record: T[],
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
    async function create<T extends Record = any>(
        record: T | T[],
        typecast?: boolean,
    ): Promise<IRecord<T> | Array<IRecord<T>>> {
        const { isMany, records } = prepareWriteRecords(record)
        const body = makeWriteBody(records, typecast)

        const results = await makeApiRequest<Array<IRecord<T>>>({
            method: HttpMethod.Post,
            credentials,
            body,
        })

        if (isMany) {
            return results
        }
        return results[0]
    }
    return create
}
