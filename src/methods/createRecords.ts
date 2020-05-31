import IRequestCredentials from '../types/IRequestCredentials'
import { Record, HttpMethod, IRecord } from '../types'
import { makeApiRequest } from '../util'

export const createRecords = (credentials: IRequestCredentials) => {
    function create<T extends Record = any>(record: T, typecast?: boolean): Promise<IRecord<T>>
    function create<T extends Record = any>(
        record: T[],
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
    async function create<T extends Record = any>(
        record: T | T[],
        typecast = false,
    ): Promise<IRecord<T> | Array<IRecord<T>>> {
        const isCreateMany = Array.isArray(record)
        const records = (Array.isArray(record) ? record : [record]).map(r => ({
            fields: r,
        }))

        const body: { records: Array<{ fields: T }>; typecast?: true } = {
            records,
        }

        if (typecast) {
            body.typecast = true
        }

        const results = await makeApiRequest<Array<IRecord<T>>>({
            method: HttpMethod.Post,
            credentials,
            body,
        })

        if (isCreateMany) {
            return results
        }
        return results[0]
    }
    return create
}
