interface WriteRecords<T> {
    /** An array of arrays of the input values, split up into sets of 10 */
    recordSets: T[][]
    isMany: boolean
}

export const prepareWriteRecords = <T>(records: T | T[]): WriteRecords<T> => {
    if (Array.isArray(records)) {
        const recordSets = []
        const recordsCopy = [...records]
        while (recordsCopy.length) {
            const set = recordsCopy.splice(0, 10)
            recordSets.push(set)
        }
        return { isMany: true, recordSets }
    }
    return { isMany: false, recordSets: [[records]] }
}
