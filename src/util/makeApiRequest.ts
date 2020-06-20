import fetch, { Response } from 'node-fetch'
import { makeApiUrl } from './makeApiUrl'
import { makeRequestHeaders } from './makeRequestHeaders'
import { makeQueryString } from './makeQueryString'
import { Readable } from 'stream'
import { HttpError } from './HttpError'
import { HttpMethod, IRequestCredentials } from '../types'

const throwErrorIfInvalidHttpStatus = (response: Response) => {
    if (!response.ok) {
        throw new HttpError(response.status, response.statusText)
    }
}

type Request = {
    method: HttpMethod
    credentials: IRequestCredentials
    recordId?: string
    query?: { [index: string]: any }
    body?: { [index: string]: any }
}

export const makeApiRequest = async <T = any>({
    method,
    credentials,
    recordId,
    query,
    body,
}: Request): Promise<T> => {
    const urlBase = makeApiUrl(credentials, recordId)
    const url = query ? `${urlBase}?${makeQueryString(query)}` : urlBase
    const headers = makeRequestHeaders(credentials)
    const readableBody = body ? Readable.from(JSON.stringify(body)) : Readable.from('')
    const response = await fetch(url, {
        body: readableBody,
        headers,
        method,
    })

    throwErrorIfInvalidHttpStatus(response)
    return response.json()
}
