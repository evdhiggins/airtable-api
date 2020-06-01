import IRequestCredentials from '../types/IRequestCredentials'
import { HttpMethod } from '../types'
import { makeApiRequest } from '../util'

interface DeletedRecord {
    id: string
    deleted: boolean
}

export const deleteRecords = (credentials: IRequestCredentials) => {
    function remove(id: string): Promise<DeletedRecord>
    function remove(ids: string[]): Promise<DeletedRecord[]>
    async function remove(ids: string | string[]): Promise<DeletedRecord | DeletedRecord[]> {
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
    return remove
}
