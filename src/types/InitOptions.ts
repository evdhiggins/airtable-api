import { RequestCredentials } from './RequestCredentials'
import { IThrottle } from './IThrottle'

type ThrottleOptions =
    | {
          throttleEnabled?: false
      }
    | {
          /** Toggle request throttling. Default: true */
          throttleEnabled: true
          /** The number of requests permitted per second. Default: 4 */
          requestsPerSecond?: number
          /** A custom throttle function to be used for all AirtableApi methods */
          customThrottle?: IThrottle
      }

export type InitOptions = RequestCredentials & ThrottleOptions
