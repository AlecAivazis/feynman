// external imports
import { put } from 'redux-saga/effects'
// local imports
import { addAnchors, addPropagators, addElements } from 'actions/elements'
import { placeElementWorker } from '..'

describe('Sagas', () => {
    describe('Place Elements', () => {
        describe('Diagram', () => {
            test('can place a full diagram', () => {
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
                expect(gen.next().value).toEqual(
                    put(addAnchors(...desc.anchors))
                )
                // then we have to add the propagators
                expect(gen.next().value).toEqual(
                    put(addPropagators(...desc.propagators))
                )
            })

            test('can place propagators with inline anchor defs', () => {
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
                expect(gen.next().value).toEqual(
                    put(addAnchors(...desc.anchors, desc.propagators[1].anchor2))
                )

                // then we have to add the propagators
                expect(gen.next().value).toEqual(
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
                expect(gen.next().done).toBeTruthy()
            })

            test('patterns can include text', () => {
                // the description of the anchor to create
                const desc = {
                    type: 'pattern',
                    text: [
                        {
                            id: 1,
                            x: 50,
                            y: 50,
                            value: "hello"
                        }
                    ]
                }

                // get the generator
                const gen = placeElementWorker({type: 'hello', payload: desc})
                const { value } = gen.next()

                // then we have to add the propagators
                expect(value).toEqual(
                    put(addElements(
                        {
                            type: 'text',
                            ...desc.text[0]
                        },
                    ))
                )

                // make sure there isn't anything left
                expect(gen.next().done).toBeTruthy()
            })
        })

        describe('Shapes', () => {
            test('patterns place shapes before anchors to avoid null constraint references', () => {
                // the description of the anchor to create
                const desc = {
                    type: 'pattern',
                    anchors: [
                        {
                            id: 1,
                            x: 50,
                            y: 60,
                        }
                    ],
                    shapes: [
                        {
                            id: 1,
                            x: 50,
                            y: 50,
                            kind: "parton"
                        }
                    ]
                }

                // get the generator
                const gen = placeElementWorker({type: 'hello', payload: desc})

                // first make sure we added tests to avoid null constraint references
                expect(gen.next().value).toEqual(
                    put(addElements(
                        {
                            type: 'shapes',
                            ...desc.shapes[0]
                        },
                    ))
                )

                // then we add the anchors
                expect(gen.next().value).toEqual(
                    put(addAnchors(...desc.anchors))
                )

                // make sure there isn't anything left
                expect(gen.next().done).toBeTruthy()
            })
        })
    })
})
