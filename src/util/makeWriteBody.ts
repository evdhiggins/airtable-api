import { JsonType } from '../types'

type WriteBody<T> = { records: T[]; typecast?: true }

export const makeWriteBody = <T>(records: T[], typecast?: boolean): Record<string, JsonType> => {
    const body: WriteBody<T> = { records }
    if (typecast) {
        body.typecast = true
    }
    return (body as unknown) as Record<string, JsonType>
}
