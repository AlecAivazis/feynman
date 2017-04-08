// local imports
import { anchorsInSpec } from '..'
import * as specMap from '../../specs'

describe('Utils', () => {
    describe('AnchorsInSpec util', () => {
        test('gracefully handles null spec', () => {
            // create an invalid spec
            const spec = null
            // searching through this spec should generate an error
            expect(anchorsInSpec(spec)).toEqual([])
        })

        test('returns the anchors in a propagator spec', () => {
            // create a propagator spec
            const spec = specMap.propagators({
                x: 50,
                y: 100,
                info: { gridSize: 50 },
                elements: { anchors: {}, propagators: {} },
                config: {},
            })
            // look for the anchors in the spec
            const anchors = anchorsInSpec(spec)

            // there should be 2 anchors for any propagator
            expect(anchors).toHaveLength(2)
        })

        test('handles text types', () => {
            // the spec for text
            const spec = {element: {type: 'text', value: 'hello', x: 50, y: 1000}}
            // there are no anchors in text
            expect(anchorsInSpec(spec)).toHaveLength(0)
        })

        test('handles shapes types', () => {
            // the spec for text
            const spec = {element: {type: 'shapes', kind: 'parton', x: 50, y: 1000}}
            // there are no anchors in text
            expect(anchorsInSpec(spec)).toHaveLength(0)
        })
    })
})
