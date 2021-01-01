export type UpdatedRecord<T> =
    | {
          id: string
          createdTime: string
          fields: T
          wasUpdated: true
      }
    | {
          id: string
          createdTime?: undefined
          fields: Partial<T>
          wasUpdated: false
          errorMessage: string
      }

export type CreatedRecord<T> =
    | {
          id: string
          createdTime: string
          fields: T
          wasCreated: true
      }
    | {
          id: string
          createdTime?: undefined
          fields: T
          wasCreated: false
          errorMessage: string
      }

export type DeletedRecord = {
    id: string
    wasDeleted: boolean
}

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

export interface RecordToUpdate<T> {
    id: string
    fields: T
}
