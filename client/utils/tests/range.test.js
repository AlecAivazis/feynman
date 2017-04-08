// local imports
import range from '../range'

describe('Utils', function() {
    describe('Range util', function() {
        it('returns correct array', function () {
            expect(range(5)).toEqual([0,1,2,3,4])
        })
    })
})
