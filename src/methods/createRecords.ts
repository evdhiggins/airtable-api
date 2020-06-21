import { RecordItem, HttpMethod, IRecord, IAirtableApi, IRequestCredentials } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'

export const createRecords = (credentials: IRequestCredentials): IAirtableApi['createRecords'] =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function <T extends RecordItem>(record: T | T[], typecast?: boolean): Promise<any> {
        const { isMany, recordSets } = prepareWriteRecords(record)

        const promises = recordSets.map((set) => {
            const body = makeWriteBody(set, typecast)

            return makeApiRequest<Array<IRecord<T>>>({
                method: HttpMethod.Post,
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
