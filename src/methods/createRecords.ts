import IRequestCredentials from '../types/IRequestCredentials'
import { Record, HttpMethod, IRecord, IAirtableApi } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'

export const createRecords = (credentials: IRequestCredentials): IAirtableApi['createRecords'] =>
    async function<T extends Record = any>(record: T | T[], typecast?: boolean): Promise<any> {
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
