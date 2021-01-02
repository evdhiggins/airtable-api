import { TableConnection } from './TableConnection'
import { RecordItem, IThrottle, BaseConnectionCredentials, ThrottleOptions } from './types'
import { makeThrottle, throttleStub } from './util'

export class BaseConnection {
    private readonly credentials: BaseConnectionCredentials
    private readonly throttle: IThrottle
    private readonly tableConnections = new Map<string, TableConnection<Record<string, unknown>>>()

    constructor(options: BaseConnectionCredentials & ThrottleOptions) {
        this.credentials = {
            apiKey: options.apiKey,
            baseId: options.baseId,
        }

        if (options.throttleEnabled === false) {
            this.throttle = throttleStub
        } else {
            const requestsPerSecond =
                options?.requestsPerSecond && options.requestsPerSecond > 0 ? options.requestsPerSecond : 4
            this.throttle = options?.customThrottle ?? makeThrottle(requestsPerSecond, 1000)
        }
    }

    public forTable<T extends RecordItem>(tableId: string): TableConnection<T> {
        if (!this.tableConnections.has(tableId)) {
            const tableConnection = new TableConnection<T>({
                ...this.credentials,
                tableId,
                customThrottle: this.throttle,
                throttleEnabled: true,
            })
            this.tableConnections.set(tableId, tableConnection)
        }
        return this.tableConnections.get(tableId) as TableConnection<T>
    }
}
