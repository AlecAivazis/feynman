// local imports
import { createStore } from 'store'
import reducer from '..'
import {
    selectElements,
    addAnchors,
    clearSelection,
    mergeElements,
    addPropagators,
    setElementAttrs,
    deleteElements,
    clearElements,
    deleteSelection,
} from 'actions/elements'
import { setGridSize } from 'actions/info'
import {initialState as intialSelection} from '../selection'
import {initialState as initialReducerState} from '..'


describe('Reducers', function() {
    describe('Elements reducer', function() {
        describe('Merging', function() {

            it('merges anchors that are located at the same location', function() {
                // the location of the conflict
                const coords = {
                    x: 50,
                    y: 50,
                }
                // start off with some anchors
                const anchorState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        ...coords,
                    },
                    {
                        id: 2,
                        ...coords,
                    },
                    {
                        id: 3,
                        x: 300,
                        y: 500,
                    }
                ))

                // tell the reducer to merge itself
                const mergedState = reducer(anchorState, mergeElements(1))

                // make sure there are only two anchors left
                expect(Object.values(mergedState.anchors)).to.have.length(2)

                // make sure the first entry does not exist
                expect(mergedState.anchors[2].x).to.equal(coords.x)
                expect(mergedState.anchors[2].y).to.equal(coords.y)
                // make sure the second is valid
                expect(mergedState.anchors[1]).to.not.exist
                // make sure the third was left untouched
                expect(mergedState.anchors[3].x).to.equal(300)
                expect(mergedState.anchors[3].y).to.equal(500)

                // make sure there are no anchors left over
                expect(Object.values(mergedState.anchors)).to.have.length(2)
            })

            it('replaces anchor references when merging', function() {
                // the location of the conflict
                const coords = {
                    x: 50,
                    y: 50,
                }

                // start off with some anchors
                const anchorState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        ...coords,
                    },
                    {
                        id: 2,
                        ...coords,
                    },
                    {
                        id: 3,
                        x: 300,
                        y: 500,
                    }
                ))

                // add a propagator
                const propagatorState = reducer(anchorState, addPropagators(
                    {
                        kind: 'fermion',
                        id: 1,
                        anchor1: 2,
                        anchor2: 3
                    }
                ))

                // tell the store to merge elements onto anchor 1
                const mergedState = reducer(propagatorState, mergeElements(1))

                // since that should replace anchor 1, the propagotr's anchor1 value should be 2
                expect(mergedState.propagators[1].anchor1).to.equal(2)
            })

            it('can select the resulting element after merge', function() {
                // the location of the conflict
                const coords = {
                    x: 50,
                    y: 50,
                }

                // start off with some anchors
                const anchorState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        ...coords,
                    },
                    {
                        id: 2,
                        ...coords,
                    },
                ))

                // tell the reducer to merge itself
                const mergedState = reducer(anchorState, mergeElements(1, true))

                // make sure the resulting selection contains just the target
                expect(mergedState.selection.anchors).to.deep.equal([2])
            })

            it('barfs if merging onto an undefined id', function() {
                expect(() => reducer(undefined, mergeElements(undefined))).to.throw(Error)
            })

            it('barfs if merging onto a non-existant id', function() {
                expect(() => reducer(undefined, mergeElements(1))).to.throw(Error)
            })
        })


        describe('Misc', function() {
            it('has a default value', function() {
                // pass an undefined current state
                const val = reducer(undefined, {type: "init"})
                // expect the default initial state
                expect(val).to.exist
            })

            it('can clear all elements', function() {
                // add some anchors to a store
                const initialState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                ))

                // clear all elements
                const clearedState = reducer(initialState, clearElements())
                // make sure there are no elements
                expect(clearedState).to.deep.equal(initialReducerState)
            })
        })

        describe('Update Elements', function() {

            it('responds to the SET_ELEMENT_ATTRS action', function() {
                // add some anchors to a store
                const initialState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                ))

                // the action to update the initial state
                const updatedState = reducer(initialState, setElementAttrs({
                    type: 'anchors',
                    id: 1,
                    x: 100
                }))

                // make sure the appropriate anchor was updated
                expect(updatedState.anchors[1].x).to.equal(100)
            })

            it('barfs if there is no id given', function() {
                // the invalid action
                const action = setElementAttrs({
                    type: 'foo',
                    x: 5
                })
                // make sure it throw an error
                expect(() => reducer(undefined, action)).to.throw(Error)
            })

            it('barfs if there is no type given', function() {
                // the invalid action
                const action = setElementAttrs({
                    id: 1,
                    x: 5
                })
                // make sure it throw an error
                expect(() => reducer(undefined, action)).to.throw(Error)
            })

            it('barfs if appropriate element cannot be found', function() {
                // the invalid action
                const action = setElementAttrs({
                    type: 'foo',
                    id: 1,
                    x: 5
                })
                // make sure it throw an error
                expect(() => reducer(undefined, action)).to.throw(Error)
            })
        })

        describe('Delete', function() {
            it('can delete elements', function() {
                // add some anchors to a store
                const initialState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                ))

                // delete one of those anchors
                const deletedState = reducer(initialState, deleteElements({
                    type: 'anchors',
                    id: 1,
                }))

                // make sure anchor 1 doesn't exist
                expect(deletedState.anchors[1]).to.not.exist
            })

            it('throws an error when removing an element that doesn\'t exist', function() {
                // the action to delete elements
                const action = deleteElements({
                    type: 'anchors',
                    id: 1,
                })

                // delete one of those anchors
                expect(() => reducer(initialState, action)).to.throw(Error)
            })

            it('removes associated propagators when removing an anchor', function() {
                // add some anchors to a store
                const initialState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    },
                    {
                        id: 3,
                        x: 100,
                        y: 100,
                    },
                    {
                        id: 4,
                        x: 100,
                        y: 100,
                    }
                ))

                // and a propagator between the two anchors
                const propagatorState = reducer(initialState, addPropagators(
                    {
                        kind: 'fermion',
                        id: 1,
                        anchor1: 1,
                        anchor2: 2,
                    },
                    {
                        kind: 'em',
                        id: 2,
                        anchor1: 3,
                        anchor2: 4,
                    }
                ))

                // delete one of those anchors
                const deletedState = reducer(propagatorState, deleteElements({
                    type: 'anchors',
                    id: 1,
                }))

                // make sure there are no propagators left
                expect(Object.keys(deletedState.propagators)).to.have.length(1)
            })

            it('deleting a selcted object deselects it', function() {
                // add some anchors to a store to start
                const initialState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 200,
                    },
                ))

                // select the element
                const selectedState = reducer(initialState, selectElements(
                    {type: 'anchors', id: 1},
                    {type: 'anchors', id: 2},
                ))

                // sanity check
                expect(selectedState.selection.anchors).to.have.length(2)

                // delete the element
                const deletedState = reducer(selectedState, deleteElements({type: 'anchors', id: 1}))

                // make sure there that there one element selected
                expect(deletedState.selection.anchors).to.deep.equal([2])
            })
        })


        describe('Selection', function() {
            it('responds to the SELECT_ELEMENTS action', function() {
                // add some anchors
                const addAction = addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                    }
                )
                const state = reducer(undefined, addAction)

                // the selection
                const selection = [
                    {
                        type: 'anchors',
                        id: 1
                    },
                    {
                        type: 'anchors',
                        id: 2
                    }
                ]
                // create an action to fire
                const selectAction = selectElements(...selection)

                // pass the action to the reducer in the intermediate state
                const val = reducer(state, selectAction)

                // make sure the selection is present
                expect(val.selection.anchors).to.deep.equal(selection.map(({id}) => id))
            })

            it('throws an error if selecting an anchor that doesn\'t exist', function() {
                // the selection
                const selection = [
                    {
                        type: 'anchors',
                        id: 1
                    },
                ]
                // the action to throw
                const action = selectElements(...selection)

                expect(() => reducer(undefined, action)).to.throw(Error)
            })

            it('responds to the CLEAR_SELECTION action', function() {
                // add some anchors
                const addAction = addAnchors({
                    id: 1,
                    x: 50,
                    y: 100,
                })
                const withAnchors = reducer(undefined, addAction)
                // add some anchors
                const selectAction = selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    }
                )
                const selected = reducer(withAnchors, selectAction)
                // sanity check
                expect(selected.selection.anchors).to.have.length(1)

                // clear the selection
                const clearedState = reducer(selected, clearSelection())

                // make sure the selection is emtpy
                expect(clearedState.selection).to.deep.equal(intialSelection)
            })

            it('removes anchors with the DELETE_SELECTION action', function() {
                // add some anchors
                const addAction = addAnchors({
                    id: 1,
                    x: 50,
                    y: 100,
                })
                const withAnchors = reducer(undefined, addAction)
                // select some anchors
                const selectAction = selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    }
                )
                const selected = reducer(withAnchors, selectAction)
                // sanity check
                expect(selected.selection.anchors).to.have.length(1)

                // delete the selection
                const deleted = reducer(selected, deleteSelection())

                // make sure there are no selected anchors
                expect(deleted.selection.anchors).to.have.length(0)
                // make sure there are no anchors in the reducer
                expect(Object.keys(deleted.anchors)).to.have.length(0)
            })

            it('removes associated propagators when removing a selected anchor', function() {
                // add some anchors
                const withAnchors = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 200
                    }
                ))
                // add a propagator between the anchors
                const withPropagators = reducer(withAnchors, addPropagators(
                    {
                        id: 1,
                        anchor1: 1,
                        anchor2: 2,
                        kind: 'fermion',
                    }
                ))
                // select some anchors
                const selected = reducer(withPropagators, selectElements(
                    {
                        type: 'anchors',
                        id: 1,
                    }
                ))
                // sanity check
                expect(selected.selection.anchors).to.have.length(1)

                // delete the selection
                const deleted = reducer(selected, deleteSelection())

                // make sure there are no selected anchors
                expect(deleted.selection.anchors).to.have.length(0)
                // make sure there are no anchors in the reducer
                expect(Object.keys(deleted.anchors)).to.have.length(1)
                // and that we deleted the propagator
                expect(Object.keys(deleted.propagators)).to.have.length(0)
            })
        })
    })
})
