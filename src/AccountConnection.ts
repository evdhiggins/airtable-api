import { BaseConnection } from './BaseConnection'
import { IThrottle, ThrottleOptions, AccountConnectionCredentials } from './types'
import { makeThrottle, throttleStub } from './util'

export class AccountConnection {
    private readonly credentials: AccountConnectionCredentials
    private readonly throttle: IThrottle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly baseConnections = new Map<string, BaseConnection>()

    constructor(options: AccountConnectionCredentials & ThrottleOptions) {
        this.credentials = {
            apiKey: options.apiKey,
        }

        if (options.throttleEnabled === false) {
            this.throttle = throttleStub
        } else {
            const requestsPerSecond =
                options?.requestsPerSecond && options.requestsPerSecond > 0 ? options.requestsPerSecond : 4
            this.throttle = options?.customThrottle ?? makeThrottle(requestsPerSecond, 1000)
        }
    }

    public forBase(baseId: string): BaseConnection {
        if (!this.baseConnections.has(baseId)) {
            const baseConnection = new BaseConnection({
                ...this.credentials,
                baseId,
                customThrottle: this.throttle,
                throttleEnabled: true,
            })
            this.baseConnections.set(baseId, baseConnection)
        }
        return this.baseConnections.get(baseId) as BaseConnection
    }
}
