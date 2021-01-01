import * as methods from './methods'
import {
    RecordItem,
    IAirtableApi,
    DeletedRecord,
    AirtableRecord,
    UpdateRecord,
    RequestCredentials,
    InitOptions,
    Filter,
    ListResults,
    IThrottle,
} from './types'
import { CreatedRecord, UpdatedRecord } from './types/recordTypes'
import { throttleFactory, throttleStub } from './util'

export class AirtableApi<T extends RecordItem> implements IAirtableApi<T> {
    private readonly credentials: RequestCredentials
    private throttle: IThrottle

    constructor(options: InitOptions) {
        this.credentials = {
            apiKey: options.apiKey,
            baseId: options.baseId,
            tableId: options.tableId,
        }

        if (options.throttleEnabled) {
            const requestsPerSecond =
                options?.requestsPerSecond && options.requestsPerSecond > 0 ? options.requestsPerSecond : 4
            const throttleFn = options?.customThrottle ?? throttleFactory(requestsPerSecond, 1000)
            this.throttle = throttleFn
        } else {
            this.throttle = throttleStub
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

    public replaceRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    public replaceRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<UpdatedRecord<T>>>
    public replaceRecords(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<UpdatedRecord<T>[] | UpdatedRecord<T> | null> {
        return methods.replaceRecords(this.credentials, this.throttle)(recordOrRecords, typecast)
    }

    public retrieveRecord(recordId: string): Promise<AirtableRecord<T> | null> {
        return methods.retrieveRecord<T>(this.credentials, this.throttle)(recordId)
    }

    public updateRecords(record: UpdateRecord<Partial<T>>, typecast?: boolean): Promise<UpdatedRecord<T> | null>
    public updateRecords(records: Array<UpdateRecord<Partial<T>>>, typecast?: boolean): Promise<Array<UpdatedRecord<T>>>
    public updateRecords(
        recordOrRecords: UpdateRecord<Partial<T>> | Array<UpdateRecord<Partial<T>>>,
        typecast?: boolean,
    ): Promise<null | UpdatedRecord<T> | UpdatedRecord<T>[]> {
        return methods.updateRecords(this.credentials, this.throttle)(recordOrRecords, typecast)
    }
}
