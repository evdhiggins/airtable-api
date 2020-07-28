import { RecordItem, UpdateRecord, RequestCredentials, MethodThrottleArg } from '../types'
import { updateOrReplaceRecords } from './updateOrReplaceRecords'
import { parseThrottleArg } from '../util'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const replaceRecords = <T extends RecordItem>(
    credentials: RequestCredentials,
    throttleArg?: MethodThrottleArg,
) => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function (
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return updateOrReplaceRecords(credentials, throttle, true, recordOrRecords, typecast)
    }
}
