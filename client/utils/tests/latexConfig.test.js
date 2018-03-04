// local imports
import { latexConfig, shapeConfig } from '../latexConfig'
import { addAnchors, addPropagators, addElements } from 'actions/elements'
import { createStore } from 'store'

describe('Utils', () => {
    describe('Latex Config util', () => {
        test('returns the correct config for a propagator', () => {
            // since the util expects and object similar to the elements reducer
            const store = createStore()

            // add anchors in known location
            store.dispatch(
                addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 50,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                )
            )

            // add a propagator with known config
            store.dispatch(
                addPropagators({
                    id: 1,
                    kind: 'fermion',
                    anchor1: 1,
                    anchor2: 2,
                    label: 'l',
                })
            )

            // the expected propagator string
            const propagatorConfig = '\\fermion[label=$l$]{0.00, 1.00}{1.00, 0.00}'
            const computed = latexConfig(store.getState().diagram.elements)

            expect(computed).toContain(propagatorConfig)
        })

        test('can compute the config for a parton', () => {
            // a store to test with
            const store = createStore()

            // add anchors in known location
            store.dispatch(
                addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 50,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                )
            )

            // add a shape with known configuration
            store.dispatch(
                addElements({
                    type: 'shapes',
                    kind: 'parton',
                    x: 50,
                    y: 50,
                    r: 50,
                })
            )

            // the expected configuration
            const partonCofig = '\\parton{0.00,1.00}{1.00}'
            const computed = latexConfig(store.getState().diagram.elements)

            expect(computed).toContain(partonCofig)
        })

        test('can compute the config for a text element', () => {
            // a store to test with
            const store = createStore()

            // add anchors in known location
            store.dispatch(
                addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 50,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                )
            )

            // add a shape with known configuration
            store.dispatch(
                addElements({
                    type: 'text',
                    x: 50,
                    y: 50,
                    value: 'hello!',
                })
            )

            // the expected configuration
            const partonCofig = '\\text{0.00,1.00}{hello!}'
            const computed = latexConfig(store.getState().diagram.elements)

            expect(computed).toContain(partonCofig)
        })
    })
})
