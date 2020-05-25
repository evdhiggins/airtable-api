import IRequestCredentials from './IRequestCredentials'

interface IInitOptions extends IRequestCredentials {
    /** Toggle request throttling. Default: true */
    throttleEnabled: boolean
    /** The number of requests permitted per second. Default: 4 */
    requestsPerSecond: number
}

export default IInitOptions
