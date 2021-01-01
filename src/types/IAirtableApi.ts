import { RecordItem, AirtableRecord, Filter, ListResults } from '.'
import { CreatedRecord, DeletedRecord, UpdatedRecord } from './recordTypes'

export interface UpdateRecord<T> {
    id: string
    fields: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IAirtableApi<T extends RecordItem = any> {
    createRecords(record: T, typecast?: boolean): Promise<CreatedRecord<T>>
    createRecords(record: T[], typecast?: boolean): Promise<Array<CreatedRecord<T>>>
    deleteRecords(id: string): Promise<DeletedRecord>
    deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    listRecords(filterStringOrFilters?: string | Filter): Promise<ListResults<T>>
    replaceRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    replaceRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<UpdatedRecord<T>>>
    retrieveRecord(recordId: string): Promise<AirtableRecord<T> | null>
    updateRecords(record: UpdateRecord<Partial<T>>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    updateRecords(records: Array<UpdateRecord<Partial<T>>>, typecast?: boolean): Promise<Array<UpdatedRecord<T>>>
}
