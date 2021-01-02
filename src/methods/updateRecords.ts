import { RecordItem, RecordToUpdate, TableConnectionCredentials, MethodThrottleArg } from '../types'
import { parseThrottleArg } from '../util'
import { updateOrReplaceRecords } from './updateOrReplaceRecords'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const updateRecords = <T extends RecordItem>(
    credentials: TableConnectionCredentials,
    throttleArg?: MethodThrottleArg,
) => {
    const throttle = parseThrottleArg(throttleArg, credentials)
    return async function (
        recordOrRecords: RecordToUpdate<Partial<T>> | Array<RecordToUpdate<Partial<T>>>,
        typecast?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
        return updateOrReplaceRecords(credentials, throttle, false, recordOrRecords, typecast)
    }
}
