import { RecordItem, Record, Filter, ListResults } from '.'

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
    createRecords(record: T, typecast?: boolean): Promise<Record<T>>
    createRecords(record: T[], typecast?: boolean): Promise<Array<Record<T>>>
    deleteRecords(id: string): Promise<DeletedRecord>
    deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    listRecords(filterStringOrFilters?: string | Filter): Promise<ListResults<T>>
    replaceRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<Record<T>>
    replaceRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<Record<T>>>
    retrieveRecord(recordId: string): Promise<T | null>
    updateRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<Record<T>>
    updateRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<Record<T>>>
}
