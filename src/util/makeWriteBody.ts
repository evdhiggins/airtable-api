export const makeWriteBody = <T>(records: T[], typecast?: boolean) => {
    if (typecast) {
        return { records, typecast: true }
    }
    return { records }
}
