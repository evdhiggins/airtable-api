export interface RecordAttachment {
    url: string
}

export interface RecordImage {
    url: string
}

export type JsonType = string | number | boolean | null | JsonType[] | { [key: string]: JsonType }

export type RecordItem = Record<string, string | number | boolean | string[] | RecordAttachment[] | RecordImage[]>

export enum HttpMethod {
    Delete = 'delete',
    Get = 'get',
    Patch = 'patch',
    Post = 'post',
    Put = 'put',
}

export * from './errors'
export * from './IAirtableApi'
export * from './IFilters'
export * from './IInitOptions'
export * from './IListResults'
export * from './IOptions'
export * from './IRecord'
export * from './IRequestCredentials'
export * from './IThrottle'
