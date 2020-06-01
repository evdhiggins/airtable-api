import { Record, IRecord } from '.'
import { IListResults } from './IListResults'

export interface DeletedRecord {
    id: string
    deleted: boolean
}

export interface UpdateRecord<T> {
    recordId: string
    fields: T
}

export interface IAirtableApi {
    createRecords<T extends Record = any>(record: T, typecast?: boolean): Promise<IRecord<T>>
    createRecords<T extends Record = any>(
        record: T[],
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
    deleteRecords(id: string): Promise<DeletedRecord>
    deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    listRecords<T extends Record = any>(
        filterStringOrFilters?: string | IFilter,
    ): Promise<IListResults<T>>
    retrieveRecord<T extends Record = any>(recordId: string): Promise<T | null>
    updateRecords<T extends Record = any>(
        record: UpdateRecord<T>,
        typecast?: boolean,
    ): Promise<IRecord<T>>
    updateRecords<T extends Record = any>(
        records: Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
    replaceRecords<T extends Record = any>(
        record: UpdateRecord<T>,
        typecast?: boolean,
    ): Promise<IRecord<T>>
    replaceRecords<T extends Record = any>(
        records: Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
}
