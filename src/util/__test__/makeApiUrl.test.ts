import { IRequestCredentials } from '../../types'
import { makeApiUrl } from '../makeApiUrl'

const mockCredentials: IRequestCredentials = {
    baseId: 'baseId',
    tableId: 'tableId',
    apiKey: '',
}

test('Return a string', () => {
    const url = makeApiUrl(mockCredentials)
    expect(typeof url).toBe('string')
})

test('Return expected api url with baseId and tableId', () => {
    const url = makeApiUrl(mockCredentials)
    expect(url).toBe(`https://api.airtable.com/v0/baseId/tableId`)
})

test('Return expected api url when a recordId is given', () => {
    const url = makeApiUrl(mockCredentials, 'recordId')
    expect(url).toBe(`https://api.airtable.com/v0/baseId/tableId/recordId`)
})
