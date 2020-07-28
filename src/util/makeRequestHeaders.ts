import { RequestCredentials } from '../types'

export const makeRequestHeaders = (credentials: RequestCredentials): { [index: string]: string } => ({
    Authorization: `Bearer ${credentials.apiKey}`,
})
