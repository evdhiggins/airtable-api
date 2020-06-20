import { IRequestCredentials } from '../../types'
import { makeRequestHeaders } from '../makeRequestHeaders'

const mockCredentials: IRequestCredentials = {
    apiKey: 'apiKey',
    baseId: '',
    tableId: '',
}

test('Return an object containing "Authorization" as a key', () => {
    const headers = makeRequestHeaders(mockCredentials)
    expect(headers).toHaveProperty('Authorization')
})

test('Returned object should have property Authorization header value', () => {
    const headers = makeRequestHeaders(mockCredentials)
    expect(headers.Authorization).toBe(`Bearer apiKey`)
})
