import IRequestCredentials from '../types/IRequestCredentials'

export const makeRequestHeaders = (credentials: IRequestCredentials) => ({
    Authorization: `Bearer ${credentials.apiKey}`,
})
