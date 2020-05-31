import IRequestCredentials from '../types/IRequestCredentials'
import { Record, HttpMethod } from '../types'
import { makeApiRequest, HttpError } from '../util'
import { Errors } from '../types/errors'

export const retrieveRecord = (credentials: IRequestCredentials) =>
    async function<T extends Record = any>(recordId: string): Promise<T | null> {
        try {
            return makeApiRequest({ method: HttpMethod.Get, credentials, recordId })
        } catch (err) {
            if (err instanceof HttpError && err.statusCode === Errors.NotFound) {
                return null
            }
            throw err
        }
    }
