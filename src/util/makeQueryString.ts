const makeKeyValueString = (key: string, value: string | number | boolean | object | any[]): string[] => {
    if (Array.isArray(value)) {
        return value.flatMap((v, i) => makeKeyValueString(`${key}[${i}]`, v))
    } else if (typeof value === 'object') {
        return Object.entries(value).flatMap(([k, v]) => makeKeyValueString(`${key}[${k}]`, v))
    }
    return [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`]
}

export const makeQueryString = (params: {
    [index: string]: string | number | boolean | object | string[] | object[]
}) =>
    Object.entries(params)
        .flatMap(([key, value]) => makeKeyValueString(key, value))
        .join('&')
