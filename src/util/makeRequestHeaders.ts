import { IRequestCredentials } from '../types'

export const makeRequestHeaders = (credentials: IRequestCredentials): { [index: string]: string } => ({
    Authorization: `Bearer ${credentials.apiKey}`,
})
