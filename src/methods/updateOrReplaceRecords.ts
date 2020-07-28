import { RecordItem, HttpMethod, Record, UpdateRecord, RequestCredentials, IThrottle } from '../types'
import { makeApiRequest, prepareWriteRecords, makeWriteBody } from '../util'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function updateOrReplaceRecords<T extends RecordItem>(
    credentials: RequestCredentials,
    throttle: IThrottle,
    replaceExistingRecords: boolean,
    recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
    typecast?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    const { recordSets, isMany } = prepareWriteRecords(recordOrRecords)

    const promises = recordSets.map((set) => {
        const body = makeWriteBody(set, typecast)

        return throttle(makeApiRequest, {
            method: replaceExistingRecords ? HttpMethod.Put : HttpMethod.Patch,
            credentials,
            body,
        }) as Promise<Array<Record<T>>>
    })

    const results = (await Promise.all(promises)).flat()

    if (isMany) {
        return results
    }
    return results[0]
}
