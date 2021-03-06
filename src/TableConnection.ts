import * as methods from './methods'
import {
    RecordItem,
    ITableConnection,
    DeletedRecord,
    AirtableRecord,
    RecordToUpdate,
    TableConnectionCredentials,
    Filter,
    ListResults,
    IThrottle,
    ThrottleOptions,
} from './types'
import { CreatedRecord, UpdatedRecord } from './types/recordTypes'
import { makeThrottle, throttleStub } from './util'

export class TableConnection<T extends RecordItem> implements ITableConnection<T> {
    private readonly credentials: TableConnectionCredentials
    private readonly throttle: IThrottle

    constructor(options: TableConnectionCredentials & ThrottleOptions) {
        this.credentials = {
            apiKey: options.apiKey,
            baseId: options.baseId,
            tableId: options.tableId,
        }

        if (options.throttleEnabled === false) {
            this.throttle = throttleStub
        } else {
            const requestsPerSecond =
                options?.requestsPerSecond && options.requestsPerSecond > 0 ? options.requestsPerSecond : 4
            this.throttle = options?.customThrottle ?? makeThrottle(requestsPerSecond, 1000)
        }
    }

    public createRecords(record: T, typecast?: boolean): Promise<CreatedRecord<T>>
    public createRecords(records: T[], typecast?: boolean): Promise<Array<CreatedRecord<T>>>
    public createRecords(recordOrRecords: T | T[], typecast?: boolean): Promise<CreatedRecord<T> | CreatedRecord<T>[]> {
        return methods.createRecords<T>(this.credentials, this.throttle)(recordOrRecords as T, typecast)
    }

    public deleteRecords(id: string): Promise<DeletedRecord>
    public deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    public deleteRecords(idOrIds: string | string[]): Promise<DeletedRecord | DeletedRecord[]> {
        return methods.deleteRecords(this.credentials, this.throttle)(idOrIds)
    }

    public listRecords(filterStringOrFilters?: string | Filter): Promise<ListResults<T>> {
        return methods.listRecords<T>(this.credentials, this.throttle)(filterStringOrFilters)
    }

    public replaceRecords(record: RecordToUpdate<T>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    public replaceRecords(records: Array<RecordToUpdate<T>>, typecast?: boolean): Promise<Array<UpdatedRecord<T>>>
    public replaceRecords(
        recordOrRecords: RecordToUpdate<T> | Array<RecordToUpdate<T>>,
        typecast?: boolean,
    ): Promise<UpdatedRecord<T>[] | UpdatedRecord<T> | null> {
        return methods.replaceRecords(this.credentials, this.throttle)(recordOrRecords, typecast)
    }

    public retrieveRecord(recordId: string): Promise<AirtableRecord<T> | null> {
        return methods.retrieveRecord<T>(this.credentials, this.throttle)(recordId)
    }

    public updateRecords(record: RecordToUpdate<Partial<T>>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    public updateRecords(
        records: Array<RecordToUpdate<Partial<T>>>,
        typecast?: boolean,
    ): Promise<Array<UpdatedRecord<T>>>
    public updateRecords(
        recordOrRecords: RecordToUpdate<Partial<T>> | Array<RecordToUpdate<Partial<T>>>,
        typecast?: boolean,
    ): Promise<null | UpdatedRecord<T> | UpdatedRecord<T>[]> {
        return methods.updateRecords(this.credentials, this.throttle)(recordOrRecords, typecast)
    }
}
