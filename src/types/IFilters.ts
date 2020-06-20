export interface IFilter {
    /** An array of column names to be included in returned data */
    fields?: string[]
    /**
     * A formula used to filter records.
     * The formula will be evaluated for each record,
     * and if the result is not `0`, `false`, `""`, `NaN`, `[]`,
     * or `#Error!` the record will be included in the
     * response.
     *
     * @example
     * {
     *    // filter out rows where `Column 1` is empty
     *    filterByFormula: `NOT({Column 1} = '')`
     * }
     */
    filterByFormula?: string
    /**
     * The maximum total number of records that will be returned in your requests.
     * If this value is larger than pageSize (which is 100 by default),
     * you may have to load multiple pages to reach this total.
     */
    maxRecords?: number
    /**
     * The number of records returned in each request.
     * Must be less than or equal to 100. Default is 100.
     */
    pageSize?: number
    /** The record ID from which the request results start */
    offset?: string
    /**
     * An array of sort objects that specifies how the records will be ordered.
     */
    sort?: Array<{
        /** The name of the field on which to sort  */
        field: string
        /** The sorting direction. Default is `asc` */
        direction?: 'asc' | 'desc'
    }>
    /**
     * The name or ID of a view in the table. If set, only the records in that
     * view will be returned. The records will be sorted according to the order
     * of the view unless the sort parameter is included, which overrides that order.
     * Fields hidden in this view will be returned in the results. To only return
     * a subset of fields, use the `fields` parameter.
     */
    view?: string

    /**
     *  The format that should be used for cell values. Default is `json`.
     *
     *  - `json`: cells will be formatted as JSON, depending on the field type.
     *
     *  - `string`: cells will be formatted as user-facing strings, regardless of the field type.
     */
    cellFormat?: 'json' | 'string'

    /**
     * The time zone that should be used to format dates when using `string` as the `cellFormat`.
     *
     * This parameter is required when using `string` as the `cellFormat`.
     */
    timeZone?: string
    /**
     * The user locale that should be used to format dates when using `string` as the `cellFormat`.
     *
     * This parameter is required when using `string` as the `cellFormat`.
     */
    userLocale?: string
}
