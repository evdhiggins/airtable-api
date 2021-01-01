import { AirtableApi } from './AirtableApi'
import { RecordItem, IThrottle, ConnectionCredentials, ThrottleOptions } from './types'
import { makeThrottle, throttleStub } from './util'

export class AirtableConnection {
    private readonly credentials: ConnectionCredentials
    private readonly throttle: IThrottle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly airtableApiByTable = new Map<string, AirtableApi<Record<string, any>>>()

    constructor(options: ConnectionCredentials & ThrottleOptions) {
        this.credentials = {
            apiKey: options.apiKey,
            baseId: options.baseId,
        }

        if (options.throttleEnabled) {
            const requestsPerSecond =
                options?.requestsPerSecond && options.requestsPerSecond > 0 ? options.requestsPerSecond : 4
            const throttleFn = options?.customThrottle ?? makeThrottle(requestsPerSecond, 1000)
            this.throttle = throttleFn
        } else {
            this.throttle = throttleStub
        }
    }

    public forTable<T extends RecordItem>(tableId: string): AirtableApi<T> {
        if (!this.airtableApiByTable.has(tableId)) {
            const airtableApi = new AirtableApi<T>({
                ...this.credentials,
                tableId,
                customThrottle: this.throttle,
            })
            this.airtableApiByTable.set(tableId, airtableApi)
        }
        return this.airtableApiByTable.get(tableId) as AirtableApi<T>
    }
}
