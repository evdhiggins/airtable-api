import IRequestCredentials from '../types/IRequestCredentials'

export const makeApiUrl = (credentials: IRequestCredentials, recordId?: string) => {
    const url = `https://api.airtable.com/v0/${credentials.baseId}/${credentials.tableId}`
    return recordId ? `${url}/${recordId}` : url
}
