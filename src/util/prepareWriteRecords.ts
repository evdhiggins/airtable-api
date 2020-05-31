export const prepareWriteRecords = <T>(records: T | T[]) => {
    if (Array.isArray(records)) {
        return { isMany: true, records }
    }
    return { isMany: false, records: [records] }
}
