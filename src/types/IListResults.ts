export interface IListResults<T> {
    /** The records returned in this `listRecords` request **/
    records: T[]
    /**
     * `offset` will be defined if there are more records. To fetch the next page of records, include offset in the next request's parameters,
     * or call `IListResults.nextPage()`.
     *
     * Pagination will stop when you've reached the end of your table, or once the `maxRecords` parameter is passed (if defined).
     */
    offset?: string
    /** Defined if there are more records (if `offset` is defined). Returns the next set of records available */
    nextPage?: () => Promise<IListResults<T>>
}
