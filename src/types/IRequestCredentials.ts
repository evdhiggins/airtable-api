export default interface IRequestCredentials {
    /** The Airtable API key of the request */
    apiKey: string
    /** The base ID for thie request */
    baseId: string
    /** The table ID or table name for the request */
    tableId: string
}
