export interface ConnectionCredentials {
    /** The Airtable API key of the request */
    apiKey: string
    /** The base ID for the request */
    baseId: string
}
export interface RequestCredentials extends ConnectionCredentials {
    /** The table ID or table name for the request */
    tableId: string
}
