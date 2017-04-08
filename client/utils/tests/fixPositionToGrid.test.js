// local imports
import fixPositionToGrid from '../fixPositionToGrid'

describe('Utils', () => {
    describe('Fix Position to Grid Util', () => {
        test('can correct coordinates', () => {
            // for now, the only difference between absolute and diagram coordinates
            // is the sidebar width
            expect(fixPositionToGrid({x: 48, y: 102}, 50)).toEqual({
                x: 50,
                y: 100,
            })
        })

        it ('doesn\'t round when gridsize is 0', function() {
            // for now, the only difference between absolute and diagram coordinates
            // is the sidebar width
            expect(fixPositionToGrid({x: 48, y: 102}, 0)).toEqual({
                x: 48,
                y: 102,
            })
        })
    })
})
