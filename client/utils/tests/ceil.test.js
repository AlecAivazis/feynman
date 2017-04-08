// local imports
import ceil from '../ceil'

describe('Utils', function() {
    describe('Ceil to util', function() {
        it('returns the correct value', function () {
            expect(ceil(75, 50)).toEqual(100)
        })

        it('handles zero', function() {
            expect(ceil(75, 0)).toEqual(75)
        })
    })
})
