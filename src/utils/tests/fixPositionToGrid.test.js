// local imports
import fixPositionToGrid from '../fixPositionToGrid'

describe('Utils', function() {
    describe("Fix Position to Grid Util", function() {
        it("can correct coordinates", function() {
            // for now, the only difference between absolute and diagram coordinates
            // is the sidebar width
            expect(fixPositionToGrid({x: 48, y: 102}, 50)).to.deep.equal({
                x: 50,
                y: 100,
            })
        })

        it ('doesn\'t round when gridsize is 0', function() {
            // for now, the only difference between absolute and diagram coordinates
            // is the sidebar width
            expect(fixPositionToGrid({x: 48, y: 102}, 0)).to.deep.equal({
                x: 48,
                y: 102,
            })
        })
    })
})
