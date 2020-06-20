import * as methods from './methods'
import { RecordItem, IAirtableApi, DeletedRecord, IRecord, UpdateRecord } from './types'
import IInitOptions from './types/IInitOptions'
import throttleFactory from './util/throttle'
import IRequestCredentials from './types/IRequestCredentials'
import { IListResults } from './types/IListResults'

export class AirtableApi<T extends RecordItem> implements IAirtableApi<T> {
    private apiKey: string
    private baseId: string
    private tableId: string

    private throttleEnabled: boolean
    private requestsPerSecond: number
    private throttle: ReturnType<typeof throttleFactory>

    private get credentials(): IRequestCredentials {
        return {
            apiKey: this.apiKey,
            baseId: this.baseId,
            tableId: this.tableId,
        }
    }

    constructor(options: IInitOptions) {
        this.apiKey = options.apiKey
        this.baseId = options.baseId
        this.tableId = options.tableId
        this.throttleEnabled = options.throttleEnabled === false ? false : true
        this.requestsPerSecond = +options.requestsPerSecond > 0 ? +options.requestsPerSecond : 4

        if (this.throttleEnabled) {
            this.throttle = throttleFactory(this.requestsPerSecond, 1000)
        } else {
            this.throttle = (fn, ...args) => {
                return fn(...args)
            }
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