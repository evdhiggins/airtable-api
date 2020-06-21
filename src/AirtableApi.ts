import * as methods from './methods'
import {
    RecordItem,
    IAirtableApi,
    DeletedRecord,
    IRecord,
    UpdateRecord,
    IRequestCredentials,
    IInitOptions,
    IFilter,
    IListResults,
    IThrottle,
} from './types'
import { throttleFactory, throttleStub } from './util'

export class AirtableApi<T extends RecordItem> implements IAirtableApi<T> {
    private readonly credentials: IRequestCredentials
    private throttle: IThrottle

    constructor(options: IInitOptions) {
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

    public createRecords(record: T, typecast?: boolean): Promise<IRecord<T>>
    public createRecords(records: T[], typecast?: boolean): Promise<Array<IRecord<T>>>
    public createRecords(recordOrRecords: T | T[], typecast?: boolean): Promise<IRecord<T> | IRecord<T>[]> {
        return methods.createRecords(this.credentials, this.throttle)(recordOrRecords, typecast)
    }

    public deleteRecords(id: string): Promise<DeletedRecord>
    public deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    public deleteRecords(idOrIds: string | string[]): Promise<DeletedRecord | DeletedRecord[]> {
        return methods.deleteRecords(this.credentials, this.throttle)(idOrIds)
    }

    public listRecords(filterStringOrFilters?: string | IFilter): Promise<IListResults<T>> {
        return methods.listRecords(this.credentials, this.throttle)(filterStringOrFilters)
    }

    public replaceRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<IRecord<T>>
    public replaceRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<IRecord<T>>>
    public replaceRecords(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<IRecord<T>[] | IRecord<T>> {
        return methods.replaceRecords(this.credentials, this.throttle)(recordOrRecords, typecast)
    }

    public retrieveRecord(recordId: string): Promise<T | null> {
        return methods.retrieveRecord(this.credentials, this.throttle)(recordId)
    }

    public updateRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<IRecord<T>>
    public updateRecords(records: Array<UpdateRecord<T>>, typecast?: boolean): Promise<Array<IRecord<T>>>
    public updateRecords(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<IRecord<T> | IRecord<T>[]> {
        return methods.updateRecords(this.credentials, this.throttle)(recordOrRecords, typecast)
    }
}
