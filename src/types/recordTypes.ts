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
