import { JsonType } from '../types'

type WriteBody<T> = { records: { fields: T; id?: string }[]; typecast?: true }

export const makeWriteBody = <T>(
    records: { fields: T; id?: string }[],
    typecast?: boolean,
): Record<string, JsonType> => {
    const body: WriteBody<T> = { records }
    if (typecast) {
        body.typecast = true
    }
    return body as unknown as Record<string, JsonType>
}
