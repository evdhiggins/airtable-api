import { TableConnection } from '../src'
import { CreatedRecord } from '../src/types'

type TestTableRecord = {
    ID: string
    Col1: string
}

const tableConnection = new TableConnection<TestTableRecord>({
    apiKey: process.env.API_KEY as string,
    baseId: process.env.BASE_ID as string,
    tableId: process.env.TABLE_ID as string,
    // low requests per second to avoid hitting api rate limit during testing
    requestsPerSecond: 1,
})

test('Run without error', async () => {
    const fn = () => tableConnection.createRecords({ ID: 'test-id', Col1: 'test-col1' })
    await expect(fn()).resolves.not.toThrow()
})

describe(`Given a valid payload of 3 rows`, () => {
    let results: CreatedRecord<TestTableRecord>[] = []

    const rowsToCreate: TestTableRecord[] = [
        { ID: 'id-1', Col1: 'col1-1' },
        { ID: 'id-2', Col1: 'col1-2' },
        { ID: 'id-3', Col1: 'col1-3' },
    ]

    beforeAll(async () => {
        results = await tableConnection.createRecords(rowsToCreate)
    })

    test(`Return a results object with a length of 3`, () => {
        expect(results.length).toBe(3)
    })

    test(`Each results object should contain an airtable record id, created timestamp, and fields`, () => {
        results.forEach(result => {
            expect(result).toHaveProperty('id')
            expect(result).toHaveProperty('createdTime')
            expect(result).toHaveProperty('fields')
        })
    })

    test(`Each field object should correspond with one of the rows to create elements`, () => {
        results.forEach(result => {
            const isInRowsToCreate = rowsToCreate.some(r => r.ID === result.fields.ID)
            expect(isInRowsToCreate).toBeTruthy()
        })
    })
})

describe(`Given a valid payload of a single object`, () => {
    let result: CreatedRecord<TestTableRecord>

    const rowToCreate: TestTableRecord = { ID: 'id-1', Col1: 'col1-1' }

    beforeAll(async () => {
        result = await tableConnection.createRecords(rowToCreate)
    })

    test(`Return an object containing record id, created timestamp, and fields`, () => {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('createdTime')
        expect(result).toHaveProperty('fields')
    })

    test(`Result fields should exactly match the row to create object`, () => {
        expect(result?.fields).toStrictEqual(rowToCreate)
    })
})
