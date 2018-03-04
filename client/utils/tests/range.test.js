// local imports
import range from '../range'

describe('Utils', () => {
    describe('Range util', () => {
        test('returns correct array', () => {
            expect(range(5)).toEqual([0, 1, 2, 3, 4])
        })
    })
})
