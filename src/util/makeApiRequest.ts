import * as phin from 'phin'
import { HttpMethod } from '../types'
import IRequestCredentials from '../types/IRequestCredentials'
import { makeApiUrl } from './makeApiUrl'
import { makeRequestHeaders } from './makeRequestHeaders'
import { makeQueryString } from './makeQueryString'

type Request = {
    method: HttpMethod
    credentials: IRequestCredentials
    recordId?: string
    query?: { [index: string]: any }
    body?: { [index: string]: any }
}

async function makeApiRequest({
    method,
    credentials,
    recordId,
    query,
    body,
}: Request): Promise<phin.JsonResponse> {
    const urlBase = makeApiUrl(credentials, recordId)
    const url = query ? `${urlBase}?${makeQueryString(query)}` : urlBase
    const headers = makeRequestHeaders(credentials)
    const response = await phin({
        url,
        headers,
        method,
        data: body,
        parse: 'json',
    })
    return response.body
}

export default makeApiRequest
