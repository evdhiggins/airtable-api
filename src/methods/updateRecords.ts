import { updateRecordsFactory } from './updateRecordsFactory'
import { AuthorizationWrappedIAirtableFunction } from '../types'

export const updateRecords: AuthorizationWrappedIAirtableFunction<'updateRecords'> = updateRecordsFactory(false)
