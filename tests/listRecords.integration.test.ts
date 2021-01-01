import { AirtableApi } from '../src'
import { ListResults } from '../src/types'

type TestTableRecord = {
    ID: string
    Col1: string
}

const airtableApi = new AirtableApi<TestTableRecord>({
    apiKey: process.env.API_KEY as string,
    baseId: process.env.BASE_ID as string,
    tableId: process.env.TABLE_ID as string,
    // low requests per second to avoid hitting api rate limit during testing
    requestsPerSecond: 1,
})

test('Run without error', async () => {
    const fn = () => airtableApi.listRecords({ maxRecords: 1 })
    await expect(fn()).resolves.not.toThrow()
})

describe('Given a valid request with a limit of 3 records for a table with >= 6 rows', () => {
    let results: ListResults<TestTableRecord>

    beforeAll(async () => {
        results = await airtableApi.listRecords({ pageSize: 3 })
    })

    test('Return an object containing an array of 3 `records`', () => {
        expect(Array.isArray(results?.records)).toBeTruthy()
        expect(results?.records.length).toBe(3)
    })

    test('Return an object with a truthy offset property', () => {
        expect(results?.offset).toBeTruthy()
    })

    test('Return an object containing a `nextPage` function', () => {
        expect(typeof results?.nextPage).toBe('function')
    })

    test('Returned `nextPage` function should return 3 additional records', async () => {
        const nextPageResults = await results?.nextPage?.()
        expect(nextPageResults?.records?.length).toBe(3)
    })
})
