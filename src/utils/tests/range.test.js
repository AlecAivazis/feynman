// local imports
import range from '../range'

describe('range util', function() {
    it('returns correct array', function () {
        expect(range(5)).to.deep.equal([0,1,2,3,4])
    })
})
