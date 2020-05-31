import IRequestCredentials from '../types/IRequestCredentials'

export const makeRequestHeaders = (
    credentials: IRequestCredentials,
): { [index: string]: string } => ({
    Authorization: `Bearer ${credentials.apiKey}`,
})
