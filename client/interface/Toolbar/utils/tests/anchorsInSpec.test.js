// local imports
import { anchorsInSpec } from '..'
import * as specMap from '../../specs'

describe('Utils', function() {
    describe('AnchorsInSpec util', function() {
        it('gracefully handles null spec', function() {
            // create an invalid spec
            const spec = null
            // searching through this spec should generate an error
            expect(anchorsInSpec(spec)).to.deep.equal([])
        })

        it('throws an error if looking at a spec that it can\'t search', function() {
            // create an invalid spec
            const spec = {element: {type: 'foo'}}
            // searching through this spec should generate an error
            expect(() => anchorsInSpec(spec)).to.throw(Error)
        })

        it('returns the anchors in a propagator spec', function () {
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
            expect(anchors).to.have.length(2)
        })

        it('handles text types', function() {
            // the spec for text
            const spec = {element: {type: 'text', value: 'hello', x: 50, y: 1000}}
            // there are no anchors in text
            expect(anchorsInSpec(spec)).to.have.length(0)

        })
    })
})
