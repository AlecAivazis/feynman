// local imports
import { latexConfig } from '../latexConfig'
import { addAnchors, addPropagators } from 'actions/elements'
import { createStore } from 'store'

describe('Utils', () => {
    describe('Latex Config util', () => {
        test('returns the correct config for a propagator', () => {
            // since the util expects and object similar to the elements reducer
            const store = createStore()

            // add anchors in known location
            store.dispatch(addAnchors(
                {
                    id: 1,
                    x: 50,
                    y: 50,
                },
                {
                    id: 2,
                    x: 100,
                    y: 100,
                },
            ))

            // add a propagator with known config
            store.dispatch(addPropagators({
                id: 1,
                kind: 'fermion',
                anchor1: 1,
                anchor2: 2,
                label: 'l'
            }))

            // the expected propagator string
            const propagatorConfig = "\\fermion[label=$l$]{0.00, 1.00}{1.00, 0.00}"
            const computed = latexConfig(store.getState().diagram.elements)
            console.log(computed)
            expect(computed.includes(propagatorConfig)).toBeTruthy()
        })
    })
})
