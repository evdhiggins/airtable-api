export interface RecordAttachment {
    url: string
}

export interface RecordImage {
    url: string
}

export type Record = {
    [index: string]: string | number | boolean | string[] | RecordAttachment[] | RecordImage[]
}

export enum HttpMethod {
    Delete = 'delete',
    Get = 'get',
    Patch = 'patch',
    Post = 'post',
    Put = 'put',
}

export * from './IRecord'
export * from './IAirtableApi'
