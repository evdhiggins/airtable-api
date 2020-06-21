import { JsonType } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeKeyValueString = (key: string, value: JsonType): string[] => {
    if (value === null) {
        return [`${encodeURIComponent(key)}=`]
    } else if (Array.isArray(value)) {
        return value.flatMap((v, i) => makeKeyValueString(`${key}[${i}]`, v))
    } else if (typeof value === 'object') {
        return Object.entries(value).flatMap(([k, v]) => makeKeyValueString(`${key}[${k}]`, v))
    }
    return [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`]
}

export const makeQueryString = (params: { [index: string]: JsonType }): string =>
    Object.entries(params)
        .flatMap(([key, value]) => makeKeyValueString(key, value))
        .join('&')
