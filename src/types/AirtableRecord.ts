/**
 * Represents an airtable record resource as returned from a update, replace, or create request.
 *
 * If the target record cannot be found (e.g. an update request for a deleted record) `id` will be the
 * only defined value
 */
export type AirtableRecord<T> = {
    id: string
    createdTime: string
    fields: T
}
