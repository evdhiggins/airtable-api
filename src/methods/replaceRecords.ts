import { RecordItem, UpdateRecord, IRequestCredentials, MethodThrottleArg } from '../types'
import { parseThrottleArg } from '../util/throttle'
import { updateOrReplaceRecords } from './updateOrReplaceRecords'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const replaceRecords = (credentials: IRequestCredentials, throttleArg?: MethodThrottleArg) => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function <T extends RecordItem>(
        recordOrRecords: UpdateRecord<T> | Array<UpdateRecord<T>>,
        typecast?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return updateOrReplaceRecords(credentials, throttle, true, recordOrRecords, typecast)
    }
}
