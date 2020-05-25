import { makeQueryString } from '../makeQueryString'

test('Prepare proper query string from basic string inputs', () => {
    const queryString = makeQueryString({ field1: 'value1', field2: 'value2' })
    expect(queryString).toBe('field1=value1&field2=value2')
})

test('Prepare proper query string from array inputs', () => {
    const queryString = makeQueryString({ field1: ['value0', 'value1', 'value2'] })
    expect(queryString).toBe('field1%5B0%5D=value0&field1%5B1%5D=value1&field1%5B2%5D=value2')
})

test('Prepare proper query string from object inputs', () => {
    const queryString = makeQueryString({ field1: { nested1: 1, nested2: 2 } })
    expect(queryString).toBe('field1%5Bnested1%5D=1&field1%5Bnested2%5D=2')
})

test('Prepare proper query string from deeply nested combination of arrays and objects', () => {
    const queryString = makeQueryString({ one: [{ two: { three: [{ four: 4 }] } }] })
    expect(queryString).toBe('one%5B0%5D%5Btwo%5D%5Bthree%5D%5B0%5D%5Bfour%5D=4')
})
