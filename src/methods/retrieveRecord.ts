import { RecordItem, HttpMethod, IAirtableApi, IRequestCredentials, Errors } from '../types'
import { makeApiRequest, HttpError } from '../util'

export const retrieveRecord = (credentials: IRequestCredentials): IAirtableApi['retrieveRecord'] =>
    async function <T extends RecordItem = any>(recordId: string): Promise<T | null> {
        try {
            return makeApiRequest({ method: HttpMethod.Get, credentials, recordId })
        } catch (err) {
            if (err instanceof HttpError && err.statusCode === Errors.NotFound) {
                return null
            }
            throw err
        }
    }
