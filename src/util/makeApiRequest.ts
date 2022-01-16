import fetch, { Response } from 'node-fetch'
import { Readable } from 'stream'
import { HttpMethod, TableConnectionCredentials, JsonType } from '../types'
import { makeApiUrl, makeQueryString, makeRequestHeaders, HttpError } from '.'

type ErrorResponsePayload = null | {
    error?: {
        message?: string
    }
}

const throwErrorIfInvalidHttpStatus = async (response: Response) => {
    if (!response.ok) {
        let message: string | undefined
        try {
            const errorPayload = (await response.json()) as ErrorResponsePayload
            if (errorPayload && typeof errorPayload?.error?.message === 'string') {
                message = errorPayload?.error?.message
            }
        } catch {
            // do nothing
        }
        throw new HttpError(response.status, response.statusText, message)
    }
}

type Request = {
    method: HttpMethod
    credentials: TableConnectionCredentials
    recordId?: string
    query?: Record<string, JsonType>
    body?: Record<string, JsonType> | Record<string, JsonType>[]
}

export const makeApiRequest = async <T>({ method, credentials, recordId, query, body }: Request): Promise<T> => {
    const urlBase = makeApiUrl(credentials, recordId)
    const url = query ? `${urlBase}?${makeQueryString(query)}` : urlBase
    const headers = makeRequestHeaders(credentials)
    const readableBody = body ? Readable.from(JSON.stringify(body)) : undefined
    const response = await fetch(url, {
        body: readableBody,
        headers,
        method,
    })

    await throwErrorIfInvalidHttpStatus(response)
    return response.json() as Promise<T>
}
