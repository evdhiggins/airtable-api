import { IAirtableApi } from './IAirtableApi'
import IRequestCredentials from './IRequestCredentials'

export interface RecordAttachment {
    url: string
}

export interface RecordImage {
    url: string
}

export type RecordItem = Record<
    string,
    string | number | boolean | string[] | RecordAttachment[] | RecordImage[]
>

export enum HttpMethod {
    Delete = 'delete',
    Get = 'get',
    Patch = 'patch',
    Post = 'post',
    Put = 'put',
}

export type AuthorizationWrappedIAirtableFunction<T extends keyof IAirtableApi> = (
    credentials: IRequestCredentials,
) => IAirtableApi[T]

export * from './IRecord'
export * from './IAirtableApi'
