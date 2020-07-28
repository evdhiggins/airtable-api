import { RequestCredentials } from '../types'

export const makeApiUrl = (credentials: RequestCredentials, recordId?: string): string => {
    const url = `https://api.airtable.com/v0/${credentials.baseId}/${credentials.tableId}`
    return recordId ? `${url}/${recordId}` : url
}
