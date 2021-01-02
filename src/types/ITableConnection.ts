import { RecordItem, AirtableRecord, Filter, ListResults } from '.'
import { CreatedRecord, DeletedRecord, RecordToUpdate, UpdatedRecord } from './recordTypes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ITableConnection<T extends RecordItem = any> {
    createRecords(record: T, typecast?: boolean): Promise<CreatedRecord<T>>
    createRecords(record: T[], typecast?: boolean): Promise<Array<CreatedRecord<T>>>
    deleteRecords(id: string): Promise<DeletedRecord>
    deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    listRecords(filterStringOrFilters?: string | Filter): Promise<ListResults<T>>
    replaceRecords(record: RecordToUpdate<T>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    replaceRecords(records: Array<RecordToUpdate<T>>, typecast?: boolean): Promise<Array<UpdatedRecord<T>>>
    retrieveRecord(recordId: string): Promise<AirtableRecord<T> | null>
    updateRecords(record: RecordToUpdate<Partial<T>>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    updateRecords(records: Array<RecordToUpdate<Partial<T>>>, typecast?: boolean): Promise<Array<UpdatedRecord<T>>>
}
