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
    addElements,
    snapSelectedElements,
} from 'actions/elements'
import { setGridSize } from 'actions/info'
import {initialState as intialSelection} from '../selection'
import {initialState as initialReducerState} from '..'


describe('Reducers', () => {
    describe('Elements reducer', () => {
        describe('Merging', () => {

            test('merges anchors that are located at the same location', () => {
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
                const mergedState = reducer(anchorState, mergeElements({type: "anchors", id: 1}))

                // make sure there are only two anchors left
                expect(Object.values(mergedState.anchors)).toHaveLength(2)

                // make sure the first entry does not exist
                expect(mergedState.anchors[1].x).toEqual(coords.x)
                expect(mergedState.anchors[1].y).toEqual(coords.y)
                // make sure the second is valid
                expect(mergedState.anchors[2]).not.toBeDefined()
                // make sure the third was left untouched
                expect(mergedState.anchors[3].x).toEqual(300)
                expect(mergedState.anchors[3].y).toEqual(500)

                // make sure there are no anchors left over
                expect(Object.values(mergedState.anchors)).toHaveLength(2)
            })

            test('replaces anchor references when merging', () => {
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
                const mergedState = reducer(propagatorState, mergeElements())

                // since that should replace anchor 2, the propagotr's anchor1 value should be 1
                expect(mergedState.propagators[1].anchor1).toEqual(1)
            })

            test('can select the resulting element after merge', () => {
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
                const mergedState = reducer(anchorState, mergeElements({type: "anchors", id: 1}, true))

                // make sure the resulting selection contains just the target
                expect(mergedState.selection.anchors).toEqual([1])
            })

            test('merges multiple elements at once', () => {
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
                    },
                    {
                        id: 4,
                        x: 500,
                        y: 500,
                    },
                    {
                        id: 5,
                        x: 500,
                        y: 500,
                    },
                ))

                // tell the reducer to merge itself
                const mergedState = reducer(anchorState, mergeElements({type: "anchors", id: 1}))

                // make sure the first entry is still around
                expect(mergedState.anchors[1].x).toEqual(coords.x)
                expect(mergedState.anchors[1].y).toEqual(coords.y)
                // make sure the second doesn't exist
                expect(mergedState.anchors[2]).not.toBeDefined()
                // make sure the third was left untouched
                expect(mergedState.anchors[3].x).toEqual(300)
                expect(mergedState.anchors[3].y).toEqual(500)
                // make sure 4 is still around too
                expect(mergedState.anchors[4].x).toEqual(500)
                expect(mergedState.anchors[4].y).toEqual(500)
                // and that 5 was removed
                expect(mergedState.anchors[5]).not.toBeDefined()
            })

            test('applies constraints if there is an overlap between an anchor and parton', () => {
                // start off with some anchors
                const anchorState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 50,
                    }
                ))

                // add a propagator
                const constraintShape = reducer(anchorState, addElements(
                    {
                        type: 'shapes',
                        kind: "parton",
                        id: 1,
                        r: 50,
                        x: 75,
                        y: 50,
                    }
                ))

                // tell the store to merge elements onto anchor 1
                const mergedState = reducer(constraintShape, mergeElements({type: "anchors", id: 1}))

                // make sure the appropriate anchor got the constraints
                expect(mergedState.anchors[1].constraint).toEqual(1)
            })

            test('barfs if merging onto an undefined id', () => {
                expect(() => reducer(undefined, mergeElements(undefined, true))).toThrow(Error)
            })

            test('barfs if merging onto a non-existant id', () => {
                expect(() => reducer(undefined, mergeElements({type: "anchors"}, true))).toThrow(Error)
            })
        })


        describe('Misc', () => {
            test('has a default value', () => {
                // pass an undefined current state
                const val = reducer(undefined, {type: "init"})
                // expect the default initial state
                expect(val).toBeDefined()
            })

            test('has the history enhancer', () => {
                // pass an undefined current state
                const val = reducer(undefined, {type: "init"})
                // expect the default initial state
                expect(val.history).toBeDefined()
            })

            test('can clear all elements', () => {
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
                expect(clearedState).toMatchObject(initialReducerState)
            })
        })

        describe('Add Elements', () => {
            test('responds to the ADD_ELEMENTS action', () => {
                // the anchors to add
                const anchors = {
                    1: {
                        type: "anchors",
                        id: 1,
                        x: 50,
                        y: 100,
                    },
                    2: {
                        type: "anchors",
                        id: 2,
                        x: 50,
                        y: 100,
                    }
                }
                const initialState = reducer(undefined, addElements(...Object.values(anchors)))
                // make sure the anchors were added appropriately
                expect(initialState.anchors).toEqual(anchors)
            })
        })

        describe('Update Elements', () => {

            test('responds to the SET_ELEMENT_ATTRS action', () => {
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
                expect(updatedState.anchors[1].x).toEqual(100)
            })

            test('barfs if there is no id given', () => {
                // the invalid action
                const action = setElementAttrs({
                    type: 'foo',
                    x: 5
                })
                // make sure it throw an error
                expect(() => reducer(undefined, action)).toThrow(Error)
            })

            test('barfs if there is no type given', () => {
                // the invalid action
                const action = setElementAttrs({
                    id: 1,
                    x: 5
                })
                // make sure it throw an error
                expect(() => reducer(undefined, action)).toThrow(Error)
            })

            test('barfs if appropriate element cannot be found', () => {
                // the invalid action
                const action = setElementAttrs({
                    type: 'foo',
                    id: 1,
                    x: 5
                })
                // make sure it throw an error
                expect(() => reducer(undefined, action)).toThrow(Error)
            })
        })

        describe('Delete', () => {
            test('can delete elements', () => {
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
                expect(deletedState.anchors[1]).not.toBeDefined()
            })

            test('throws an error when removing an element that doesn\'t exist', () => {
                // the action to delete elements
                const action = deleteElements({
                    type: 'anchors',
                    id: 1,
                })

                // delete one of those anchors
                expect(() => reducer(initialState, action)).toThrow(Error)
            })

            test('removes associated propagators when removing an anchor', () => {
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
                expect(Object.keys(deletedState.propagators)).toHaveLength(1)
            })

            test('deleting a selcted object deselects it', () => {
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
                expect(selectedState.selection.anchors).toHaveLength(2)

                // delete the element
                const deletedState = reducer(selectedState, deleteElements({type: 'anchors', id: 1}))

                // make sure there that there one element selected
                expect(deletedState.selection.anchors).toEqual([2])
            })
        })


        describe('Selection', () => {
            test('responds to the SELECT_ELEMENTS action', () => {
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
                expect(val.selection.anchors).toEqual(selection.map(({id}) => id))
            })

            test('throws an error if selecting an anchor that doesn\'t exist', () => {
                // the selection
                const selection = [
                    {
                        type: 'anchors',
                        id: 1
                    },
                ]
                // the action to throw
                const action = selectElements(...selection)

                expect(() => reducer(undefined, action)).toThrow(Error)
            })

            test('responds to the CLEAR_SELECTION action', () => {
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
                expect(selected.selection.anchors).toHaveLength(1)

                // clear the selection
                const clearedState = reducer(selected, clearSelection())

                // make sure the selection is emtpy
                expect(clearedState.selection).toEqual(intialSelection)
            })

            test('removes anchors with the DELETE_SELECTION action', () => {
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
                expect(selected.selection.anchors).toHaveLength(1)

                // delete the selection
                const deleted = reducer(selected, deleteSelection())

                // make sure there are no selected anchors
                expect(deleted.selection.anchors).toHaveLength(0)
                // make sure there are no anchors in the reducer
                expect(Object.keys(deleted.anchors)).toHaveLength(0)
            })

            test('removes selected text elements when deleting selection', () => {
                // start off with a text element
                const withText = reducer(undefined, addElements({
                    type: 'text',
                    value: 'hello',
                    x: 50,
                    y: 50,
                    id: 1,
                }))

                // select the text
                const selected = reducer(withText, selectElements(
                    {
                        type: 'text',
                        id: 1,
                    }
                ))
                // sanity check
                expect(selected.selection.text).toHaveLength(1)

                // delete the selection
                const deleted = reducer(selected, deleteSelection())

                // make sure the text is no longer selected
                expect(deleted.selection.text).toHaveLength(0)
                // make sure that the element was actually removed
                expect(deleted.text[1]).not.toBeDefined()
            })

            test('removes selected shapes elements when deleting selection', () => {
                // start off with a text element
                const withShapes = reducer(undefined, addElements({
                    type: 'shapes',
                    kind: 'parton',
                    x: 50,
                    y: 50,
                    id: 1,
                }))

                // select the shapes
                const selected = reducer(withShapes, selectElements(
                    {
                        type: 'shapes',
                        id: 1,
                    }
                ))
                // sanity check
                expect(selected.selection.shapes).toHaveLength(1)

                // delete the selection
                const deleted = reducer(selected, deleteSelection())

                // make sure the shapes is no longer selected
                expect(deleted.selection.shapes).toHaveLength(0)
                // make sure that the element was actually removed
                expect(deleted.shapes[1]).not.toBeDefined()

            })

            test('deleting a constraint removes any references', () => {
                // add some anchors to a store to start
                const initialState = reducer(undefined, addAnchors(
                    {
                        id: 1,
                        x: 50,
                        y: 100,
                        constraint: 1,
                    },
                ))

                // add the constraint
                const withConstraint = reducer(initialState, addElements({
                    type: 'shapes',
                    kind: 'parton',
                    x: 50,
                    y: 50,
                    id: 1,
                }))

                // select the element
                const selectedState = reducer(withConstraint, selectElements(
                    {type: 'shapes', id: 1},
                ))

                // sanity check
                expect(selectedState.selection.shapes).toHaveLength(1)

                // delete the element
                const deletedState = reducer(selectedState, deleteSelection())

                // make sure there that there one element selected
                expect(deletedState.anchors[1].constraint).not.toBeDefined()

            })

            test('removes associated propagators when removing a selected anchor', () => {
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
                expect(selected.selection.anchors).toHaveLength(1)

                // delete the selection
                const deleted = reducer(selected, deleteSelection())

                // make sure there are no selected anchors
                expect(deleted.selection.anchors).toHaveLength(0)
                // make sure there are no anchors in the reducer
                expect(Object.keys(deleted.anchors)).toHaveLength(1)
                // and that we deleted the propagator
                expect(Object.keys(deleted.propagators)).toHaveLength(0)
            })
        })
    })
})
