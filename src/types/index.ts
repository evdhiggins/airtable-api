import { IThrottle } from './IThrottle'

export interface RecordAttachment {
    url: string
}

export interface RecordImage {
    url: string
}

export type JsonType = string | number | boolean | null | JsonType[] | { [key: string]: JsonType }

export type RecordItem = Record<
    string,
    string | number | boolean | string[] | RecordAttachment[] | RecordImage[] | unknown
>

export type ThrottleOptions =
    | {
          throttleEnabled: false
      }
    | {
          /** Toggle request throttling. Default: true */
          throttleEnabled?: true | undefined
          /** The number of requests permitted per second. Default: 4 */
          requestsPerSecond?: number
          /** A custom throttle function to be used for all connection methods */
          customThrottle?: IThrottle
      }

export interface AccountConnectionCredentials {
    /** The Airtable API key of the request */
    apiKey: string
}
export interface BaseConnectionCredentials extends AccountConnectionCredentials {
    /** The base ID for the request */
    baseId: string
}
export interface TableConnectionCredentials extends BaseConnectionCredentials {
    /** The table ID or table name for the request */
    tableId: string
}

export enum HttpMethod {
    Delete = 'delete',
    Get = 'get',
    Patch = 'patch',
    Post = 'post',
    Put = 'put',
}

export enum HttpErrorStatus {
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    RequestEntityTooLarge = 413,
    InvalidRequest = 422,
    InternalServerError = 500,
    BadGateway = 502,
    ServiceUnavailable = 503,
}

export * from './ITableConnection'
export * from './Filter'
export * from './ListResults'
export * from './IThrottle'
export * from './recordTypes'
