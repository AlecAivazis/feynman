// local imports
import fixDeltaToGrid from '../fixDeltaToGrid'

describe('Utils', function() {
    describe("Fix Delta to Grid Util", function() {

        it('doesn\'t round the target with grid size === 0', function() {
            // where we are
            const origin = { x: 0, y: 0}
            // the place to move to
            const next = { x: 52, y: 103}
            // the current info / gridSize
            const info = {gridSize: 0, zoomLevel: 1}

            expect(fixDeltaToGrid({origin, next, info})).toEqual(next)
        })

        it('doesn\'t round the target with grid size === 0', function() {
            // where we are
            const origin = { x: 0, y: 0}
            // the place to move to
            const next = { x: 52, y: 103}
            // the current info / gridSize
            const info = { gridSize: 0, zoomLevel: 1 }

            expect(fixDeltaToGrid({origin, next, info})).toEqual(next)
        })

        it('rounds the location snapped to grid when appropriate', function() {
            // where we are
            const origin = { x: 0, y: 0}
            // the place to move to
            const next = { x: 52, y: 103}
            // the current info / gridSize
            const info = { gridSize: 50, zoomLevel: 1 }

            expect(fixDeltaToGrid({origin, next, info})).toEqual({
                x: 50,
                y: 100,
            })
        })

        it('incorporates the zoomLevel when there is no grid', function() {
            // where we are
            const origin = { x: 0, y: 0 }
            // the place to move to
            const next = { x: 100, y: 100 }
            // the current info / gridSize
            const info = { gridSize: 0, zoomLevel: 2 }

            expect(fixDeltaToGrid({origin, next, info})).toEqual({
                x: 100,
                y: 100,
            })
        })

        it('incorporates the zoomLevel when there is a grid', function() {
            // where we are
            const origin = { x: 0, y: 0 }
            // the place to move to
            const next = { x: 220, y: 100 }
            // the current info / gridSize
            const info = { gridSize: 50, zoomLevel: 2 }

            expect(fixDeltaToGrid({origin, next, info})).toEqual({
                x: 200,
                y: 100,
            })
        })
    })
})
