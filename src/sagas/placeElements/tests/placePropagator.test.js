// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addAnchors, addPropagators } from 'actions/elements'
import placePropagator from '../placePropagator'

describe('Sagas', function() {
    describe('Place Elements', function() {
        describe('Propagators', function() {
            it('can place a propagator of a given kind', function() {
                // the description of the propagator to create
                const desc = {
                    id: 1,
                    kind: 'fermion',
                    anchor1: {
                        id: 1,
                        x: 50,
                        y: 50,
                    },
                    anchor2: {
                        id: 1,
                        x: 75,
                        y: 80
                    }
                }



                // get the generator
                const gen = placePropagator(desc)
                // the first thing we have to do is create the two anchors
                expect(gen.next().value).to.deep.equal(
                    put(addAnchors(desc.anchor1, desc.anchor2))
                )

                // then we have to create a propagator with the right kind linking the two
                expect(gen.next().value).to.deep.equal(
                    put(addPropagators({
                        ...desc,
                        anchor1: desc.anchor1.id,
                        anchor2: desc.anchor2.id,
                    }))
                )
            })
        })
    })
})
