import { TableConnection } from '../src'
import { CreatedRecord, UpdatedRecord } from '../src/types'

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

//
// THIS TEST SUITE DEPENDS UPON createRecords WORKING CORRECTLY
//

let rowToUpdate: CreatedRecord<TestTableRecord>

beforeAll(async () => {
    rowToUpdate = await tableConnection.createRecords({ ID: 'id-to-update', Col1: 'col1' })
})

describe(`Given a valid recordId`, () => {
    let result: UpdatedRecord<TestTableRecord> | null

    beforeAll(async () => {
        result = await tableConnection.updateRecords({ id: rowToUpdate?.id, fields: { ID: 'updated-id' } })
    })

    test('Return a UpdatedRecord of the updated row', () => {
        expect(result?.id).toBe(rowToUpdate?.id)
        expect(result?.createdTime).toBe(rowToUpdate?.createdTime)
        expect(result?.fields).toStrictEqual({ ID: 'updated-id', Col1: 'col1' })
    })
})

test('Given a non-existent record id, return null', async () => {
    const result = await tableConnection.updateRecords({ id: 'rec00000000000000', fields: { Col1: 'abc' } })
    expect(result).toBe(null)
})

describe('Given an array of update values with one valid & one invalid id', () => {
    const validRecord = { id: rowToUpdate?.id, fields: { ID: 'newly-updated-id' } }
    const invalidRecord = { id: 'rec00000000000000', fields: { Col1: 'abc' } }

    let results: UpdatedRecord<TestTableRecord>[] = []

    beforeAll(async () => {
        validRecord.id = rowToUpdate.id
        results = await tableConnection.updateRecords([validRecord, invalidRecord])
    })

    test('Return an array of records with a length of 2', () => {
        expect(results.length).toBe(2)
    })

    test(`Returned updated record for validRecord should have a wasUpdated flag = true`, () => {
        const updatedRecord = results.find(r => r.id === validRecord.id)
        expect(updatedRecord?.wasUpdated).toBeTruthy()
    })

    test(`Returned updated record for invalidRecord should have a wasUpdated flag = false`, () => {
        const updatedRecord = results.find(r => r.id === invalidRecord.id)
        expect(updatedRecord?.wasUpdated).not.toBeTruthy()
    })
})
