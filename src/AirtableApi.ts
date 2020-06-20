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
    ThrottledFn,
} from './types'
import { throttleFactory } from './util/throttle'

export class AirtableApi<T extends RecordItem> implements IAirtableApi<T> {
    private readonly credentials: IRequestCredentials;
    private throttle: IThrottle;

    constructor(options: IInitOptions) {
        this.credentials = {
            apiKey: options.apiKey,
            baseId: options.baseId,
            tableId: options.tableId,
        }

        if (options.throttleEnabled) {
            const requestsPerSecond = options?.requestsPerSecond && options.requestsPerSecond > 0 ? options.requestsPerSecond : 4
            const throttleFn = options?.customThrottle ?? throttleFactory(requestsPerSecond, 1000);
            this.throttle = throttleFn;
        } else {
            const throttleStub = (fn: ThrottledFn, ...args: any[]) => {
                return fn(...args);
            }
            this.throttle = throttleStub as IThrottle;
        }

    }

    public createRecords(record: T, typecast?: boolean): Promise<IRecord<T>>
    public createRecords(records: T[], typecast?: boolean): Promise<Array<IRecord<T>>>
    public createRecords(
        recordOrRecords: T | T[],
        typecast?: boolean,
    ): Promise<IRecord<T> | IRecord<T>[]> {
        return this.throttle(methods.createRecords(this.credentials), recordOrRecords, typecast)
    }

    public deleteRecords(id: string): Promise<DeletedRecord>
    public deleteRecords(ids: string[]): Promise<DeletedRecord[]>
    public deleteRecords(idOrIds: string | string[]): Promise<DeletedRecord | DeletedRecord[]> {
        return this.throttle(methods.deleteRecords(this.credentials), idOrIds)
    }

    public listRecords(filterStringOrFilters?: string | IFilter): Promise<IListResults<T>> {
        return this.throttle(methods.listRecords(this.credentials), filterStringOrFilters)
    }

    public replaceRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<IRecord<T>>
    public replaceRecords(
        records: Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
    public replaceRecords(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<IRecord<T>[] | IRecord<T>> {
        return this.throttle(methods.replaceRecords(this.credentials), recordOrRecords, typecast)
    }

    public retrieveRecord(recordId: string): Promise<T | null> {
        return this.throttle(methods.retrieveRecord(this.credentials), recordId)
    }

    public updateRecords(record: UpdateRecord<T>, typecast?: boolean): Promise<IRecord<T>>
    public updateRecords(
        records: Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<Array<IRecord<T>>>
    public updateRecords(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
    ): Promise<IRecord<T> | IRecord<T>[]> {
        return this.throttle(methods.updateRecords(this.credentials), recordOrRecords, typecast)
    }
}
