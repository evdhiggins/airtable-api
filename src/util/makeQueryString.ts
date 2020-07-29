import { JsonType } from '../types'

const encode = (input: string | number | boolean) =>
    encodeURIComponent(input)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\!/g, '%21')
        .replace(/\'/g, '%27')
        .replace(/\*/g, '%2A')
        .replace(/\~/g, '%7E')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeKeyValueString = (key: string, value: JsonType): string[] => {
    if (value === null) {
        return [`${encodeURIComponent(key)}=`]
    } else if (Array.isArray(value)) {
        return value.flatMap((v, i) => makeKeyValueString(`${key}[${i}]`, v))
    } else if (typeof value === 'object') {
        return Object.entries(value).flatMap(([k, v]) => makeKeyValueString(`${key}[${k}]`, v))
    }
    return [`${encode(key)}=${encode(value)}`]
}

export const makeQueryString = (params: { [index: string]: JsonType }): string =>
    Object.entries(params)
        .flatMap(([key, value]) => makeKeyValueString(key, value))
        .join('&')
