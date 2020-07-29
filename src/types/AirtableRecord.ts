export interface AirtableRecord<T> {
    id: string
    createdTime: string
    fields: T
}
