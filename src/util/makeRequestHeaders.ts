import { TableConnectionCredentials } from '../types'

export const makeRequestHeaders = (credentials: TableConnectionCredentials): { [index: string]: string } => ({
    Authorization: `Bearer ${credentials.apiKey}`,
    'Content-Type': 'application/json',
})
