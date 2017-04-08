// local imports
import ceil from '../ceil'

describe('Utils', () => {
    describe('Ceil to util', () => {
        test('returns the correct value', () => {
            expect(ceil(75, 50)).toEqual(100)
        })

        test('handles zero', () => {
            expect(ceil(75, 0)).toEqual(75)
        })
    })
})
