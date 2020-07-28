import { RecordItem, UpdateRecord, RequestCredentials, MethodThrottleArg } from '../types'
import { parseThrottleArg } from '../util'
import { updateOrReplaceRecords } from './updateOrReplaceRecords'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const updateRecords = <T extends RecordItem>(
    credentials: RequestCredentials,
    throttleArg?: MethodThrottleArg,
) => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function (
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return updateOrReplaceRecords(credentials, throttle, false, recordOrRecords, typecast)
    }
}
