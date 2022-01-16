import { prepareWriteRecords } from '../prepareWriteRecords'

describe('When given a non-array value', () => {
    test('Returned object should contain isMany = false', () => {
        const value = prepareWriteRecords(1)
        expect(value.isMany).toBeFalsy()
    })
    test('Returned object should contain a recordSets property that is exclusively the given value nested in two arrays', () => {
        const value = prepareWriteRecords(1)
        expect(value.recordSets).toStrictEqual([[1]])
    })
})

const makeArrayOfGivenLength = (length: number) => Array.from({ length }, (v, i) => i)

describe('When given an array value', () => {
    test('Returned object should contain isMany = true', () => {
        const value = prepareWriteRecords([1])
        expect(value.isMany).toBeTruthy()
    })
    describe("Returned object's recordSets property...", () => {
        describe('When given an array with 50 elements', () => {
            const value = prepareWriteRecords(makeArrayOfGivenLength(50))
            test('Should have a length of 5', () => {
                expect(value.recordSets.length).toBe(5)
            })
            test('Should contain 5 arrays each with a length of 10', () => {
                value.recordSets.forEach(set => {
                    expect(set.length).toBe(10)
                })
            })
        })

        describe('When given an array with 0 elements', () => {
            const value = prepareWriteRecords([])
            test('Should be an empty array', () => {
                expect(value.recordSets).toStrictEqual([])
            })
        })

        describe('When given an array with 155 elements', () => {
            const value = prepareWriteRecords(makeArrayOfGivenLength(155))
            test('Should have a length of 16', () => {
                expect(value.recordSets.length).toBe(16)
            })
            test('Should contain 15 arrays each with a length of 10, and one array with a length of 5', () => {
                value.recordSets.forEach((set, i) => {
                    if (i < 15) {
                        expect(set.length).toBe(10)
                    } else {
                        expect(set.length).toBe(5)
                    }
                })
            })
        })
    })
})
