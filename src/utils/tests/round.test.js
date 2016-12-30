// local imports
import round from '../round'
import 'babel-polyfill'

describe('round util', function() {
    it('returns correct value', function () {
        // the table of test cases
        const table = [
            [5, 10, 10],
            [2, 10, 0],
            [15, 10, 20],
        ]

        // loop over every row in the table
        for (const [n, to, expected] of table){
            // make sure the result matches expectation
            expect(round(n, to)).to.equal(expected)
        }
    })
})
