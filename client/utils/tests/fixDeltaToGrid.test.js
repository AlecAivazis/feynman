// local imports
import fixDeltaToGrid from '../fixDeltaToGrid'

describe('Utils', () => {
    describe('Fix Delta to Grid Util', () => {

        test('doesn\'t round the target with grid size === 0', () => {
            // where we are
            const origin = { x: 0, y: 0}
            // the place to move to
            const next = { x: 52, y: 103}
            // the current info / gridSize
            const info = {gridSize: 0, zoomLevel: 1}

            expect(fixDeltaToGrid({origin, next, info})).toEqual(next)
        })

        test('doesn\'t round the target with grid size === 0', () => {
            // where we are
            const origin = { x: 0, y: 0}
            // the place to move to
            const next = { x: 52, y: 103}
            // the current info / gridSize
            const info = { gridSize: 0, zoomLevel: 1 }

            expect(fixDeltaToGrid({origin, next, info})).toEqual(next)
        })

        test('rounds the location snapped to grid when appropriate', () => {
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

        test('incorporates the zoomLevel when there is no grid', () => {
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

        test('incorporates the zoomLevel when there is a grid', () => {
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
