export enum Errors {
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    RequestEntityTooLarge = 413,
    InvalidRequest = 422,
    InternalServerError = 500,
    BadGateway = 502,
    ServiceUnavailable = 503,
}

export const SubErrors = {
    [Errors.NotFound]: {
        InvalidTable: 'TABLE_NOT_FOUND',
        InvalidRecord: 'MODEL_ID_NOT_FOUND',
    },
}

export const ErrorMessages: { [k in Errors]: string } = {
    400: 'The request is invalid',
    401: 'No authorization or invalid credentials',
    402: 'Quota reached; upgrade available through Airtable',
    403: 'Resource access forbidden',
    404: 'Resource not found',
    413: 'Request exceeds maximum payload size',
    422: 'Invalid request',
    500: 'The server encountered an unexpected condition',
    502: 'Airtable servers are restarting or there is an unexpected outage',
    503: 'The server could not process your request in time',
}

export const SubErrorMessages = {
    [Errors.NotFound]: {
        [SubErrors[Errors.NotFound].InvalidTable]: 'Table not found in application',
        [SubErrors[Errors.NotFound].InvalidRecord]: 'Record not found in table',
    },
}

export default Errors
