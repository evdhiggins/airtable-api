import { updateRecordsFactory } from './updateRecordsFactory'
import { AuthorizationWrappedIAirtableFunction } from '../types'

export const replaceRecords: AuthorizationWrappedIAirtableFunction<
    'replaceRecords'
> = updateRecordsFactory(true)
