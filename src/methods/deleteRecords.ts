import { HttpMethod, DeletedRecord, IAirtableApi, IRequestCredentials } from '../types'
import { makeApiRequest, prepareWriteRecords } from '../util'

export const deleteRecords = (credentials: IRequestCredentials): IAirtableApi['deleteRecords'] =>
    async function (ids: string | string[]): Promise<any> {
        const { isMany, recordSets: idSets } = prepareWriteRecords(ids)

        const promises = idSets.map((set) => {
            const query = { records: set }
            return makeApiRequest<{ records: DeletedRecord[] }>({
                method: HttpMethod.Delete,
                credentials,
                query,
            })
        })

        const results = (await Promise.all(promises)).reduce((acc, deletedRecord) => {
            return { records: [...acc.records, ...deletedRecord.records] }
        })

        if (isMany) {
            return results.records
        }
        return results.records[0]
    }
