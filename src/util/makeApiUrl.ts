import { IRequestCredentials } from '../types'

export const makeApiUrl = (credentials: IRequestCredentials, recordId?: string): string => {
    const url = `https://api.airtable.com/v0/${credentials.baseId}/${credentials.tableId}`
    return recordId ? `${url}/${recordId}` : url
}
