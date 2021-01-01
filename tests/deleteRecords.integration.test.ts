import { AirtableApi } from '../src'
import { CreatedRecord, DeletedRecord } from '../src/types'

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

//
// THIS TEST SUITE DEPENDS UPON createRecords WORKING CORRECTLY
//

const createRecord = () => airtableApi.createRecords({ ID: 'id-to-update', Col1: 'col1' })

describe(`Given a valid recordId`, () => {
    let createdRecord: CreatedRecord<TestTableRecord> | null

    beforeAll(async () => {
        createdRecord = await createRecord()
    })

    test('Return a DeletedRecord with wasDeleted flag = true', async () => {
        const result = await airtableApi.deleteRecords(createdRecord?.id as string)
        expect(result?.id).toBe(createdRecord?.id)
        expect(result?.wasDeleted).toBeTruthy()
    })
})

test('Given a non-existent record id, return null', async () => {
    const result = await airtableApi.deleteRecords('rec00000000000000')
    expect(result).toBe(null)
})

describe('Given an array of ids to delete with one valid & one invalid', () => {
    let validId: string
    const invalidId = 'rec00000000000000'
    let results: DeletedRecord[] = []

    beforeAll(async () => {
        const record = await createRecord()
        validId = record.id
        results = await airtableApi.deleteRecords([validId, invalidId])
    })

    test('Return an array of records with a length of 2', () => {
        expect(results.length).toBe(2)
    })

    test(`The DeletedRecord wasDeleted flag for the valid ID should be true`, () => {
        const deletedRecord = results.find((r) => r.id === validId)
        expect(deletedRecord?.wasDeleted).toBeTruthy()
    })

    test(`The DeletedRecord wasDeleted falg for the invalid ID should be false`, () => {
        const deletedRecord = results.find((r) => r.id === invalidId)
        expect(deletedRecord?.wasDeleted).not.toBeTruthy()
    })
})
