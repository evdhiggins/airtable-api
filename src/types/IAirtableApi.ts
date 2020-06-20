import { RecordItem, IRecord } from '.'
import { IListResults } from './IListResults'

export interface DeletedRecord {
    id: string
    deleted: boolean
}

export interface UpdateRecord<T> {
    recordId: string
    fields: T
}

export interface IAirtableApi<T extends RecordItem = any> {
    createRecords(record: T, typecast?: boolean): Promise<IRecord<T>>
    createRecords(record: T[], typecast?: boolean): Promise<Array<IRecord<T>>>
    deleteRecords(id: string): Promise<DeletedRecord>
    deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    listRecords(filterStringOrFilters?: string | IFilter): Promise<IListResults<T>>
    replaceRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<IRecord<T>>
    replaceRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<IRecord<T>>>
    retrieveRecord(recordId: string): Promise<T | null>
    updateRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<IRecord<T>>
    updateRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<IRecord<T>>>
}
