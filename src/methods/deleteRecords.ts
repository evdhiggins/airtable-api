import { HttpMethod, DeletedRecord, IAirtableApi, IRequestCredentials } from '../types'
import { makeApiRequest } from '../util'

export const deleteRecords = (credentials: IRequestCredentials): IAirtableApi['deleteRecords'] =>
    async function(ids: string | string[]): Promise<any> {
        const query = { records: typeof ids === 'string' ? [ids] : ids }
        const results = await makeApiRequest<{ records: DeletedRecord[] }>({
            method: HttpMethod.Delete,
            credentials,
            query,
        })
        if (Array.isArray(ids)) {
            return results.records
        }
        return results.records[0]
    }
