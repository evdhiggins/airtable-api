import { RecordItem, AirtableRecord, Filter, ListResults } from '.'

export interface DeletedRecord {
    id: string
    deleted: boolean
}

export interface UpdateRecord<T extends RecordItem> {
    recordId: string
    fields: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IAirtableApi<T extends RecordItem = any> {
    createRecords(record: T, typecast?: boolean): Promise<AirtableRecord<T>>
    createRecords(record: T[], typecast?: boolean): Promise<Array<AirtableRecord<T>>>
    deleteRecords(id: string): Promise<DeletedRecord>
    deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    listRecords(filterStringOrFilters?: string | Filter): Promise<ListResults<T>>
    replaceRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<AirtableRecord<T>>
    replaceRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<AirtableRecord<T>>>
    retrieveRecord(recordId: string): Promise<AirtableRecord<T> | null>
    updateRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<AirtableRecord<T>>
    updateRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<AirtableRecord<T>>>
}
