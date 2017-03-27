// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addAnchors, addPropagators } from 'actions/elements'
import { placeElementWorker } from '..'

describe('Sagas', function() {
    describe('Place Elements', function() {
        describe('Diagram', function() {
            it('can place a full diagram', function() {
                // the description of the anchor to create
                const desc = {
                    type: 'pattern',
                    anchors: [
                        {
                            id: 1,
                            x: 50,
                            y: 100,
                        },
                        {
                            id: 2,
                            x: 75,
                            y: 150,
                        },
                    ],
                    propagators: [
                        {
                            id: 1,
                            kind: 'fermion',
                            anchor1: 1,
                            anchor2: 2,
                        },
                        {
                            id: 2,
                            kind: 'fermion',
                            anchor1: 1,
                            anchor2: 2
                        }
                    ]
                }

                // get the generator
                const gen = placeElementWorker({type: 'hello', payload: desc})
                // first we have to create the anchors
                expect(gen.next().value).to.deep.equal(
                    put(addAnchors(...desc.anchors))
                )
                // then we have to add the propagators
                expect(gen.next().value).to.deep.equal(
                    put(addPropagators(...desc.propagators))
                )
            })
            
            it('can place propagators with inline anchor defs', function() {
                // the description of the anchor to create
                const desc = {
                    type: 'pattern',
                    anchors: [
                        {
                            id: 1,
                            x: 50,
                            y: 100,
                        },
                        {
                            id: 2,
                            x: 75,
                            y: 150,
                        },
                    ],
                    propagators: [
                        {
                            id: 1,
                            kind: 'fermion',
                            anchor1: 1,
                            anchor2: 2,
                        },
                        {
                            id: 2,
                            kind: 'fermion',
                            anchor1: 1,
                            anchor2: {
                                id: 3,
                                x: 1000,
                                y: 2000
                            }
                        }
                    ]
                }

                // get the generator
                const gen = placeElementWorker({type: 'hello', payload: desc})
                // first we have to create the anchors
                expect(gen.next().value).to.deep.equal(
                    put(addAnchors(...desc.anchors, desc.propagators[1].anchor2))
                )

                // then we have to add the propagators
                expect(gen.next().value).to.deep.equal(
                    put(addPropagators(
                        {
                            id: 1,
                            kind: 'fermion',
                            anchor1: 1,
                            anchor2: 2,
                        },
                        {
                            id: 2,
                            kind: 'fermion',
                            anchor1: 1,
                            anchor2: 3
                        }
                    ))
                )

                // make sure there isn't anything left
                expect(gen.next().done).to.be.true
            })
        })
    })
})
