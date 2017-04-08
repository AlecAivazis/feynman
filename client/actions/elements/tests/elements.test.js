// local imports
import {
    selectElements,       SELECT_ELEMENTS,
    clearSelection,       CLEAR_SELECTION,
    mergeElements,        MERGE_ELEMENTS,
    setElementAttrs,      SET_ELEMENT_ATTRS,
    deleteElements,       DELETE_ELEMENTS,
    moveSelectedElements, MOVE_SELECTED_ELEMENTS,
    clearElements,        CLEAR_ELEMENTS,
    deleteSelection,      DELETE_SELECTION,
    placeElement,         PLACE_ELEMENTS,
    loadPattern,          LOAD_PATTERN,
    addElements,          ADD_ELEMENTS,
} from 'actions/elements'

describe('Action Creators', function() {
    describe('Elements', function() {
        describe('Selection', function() {
            it('select single element', function() {
                // the elements to select
                const selection = {
                    type: 'anchor',
                    id: 1,
                }

                // check the structure of the selection anction
                expect(selectElements(selection)).toEqual({
                    type: SELECT_ELEMENTS,
                    payload: [selection]
                })
            })

            it('select mulitple elements', function() {
                // the elements to select
                const selection = [
                    {
                        type: 'anchor',
                        id: 1,
                    },
                    {
                        type: 'anchor',
                        id: 2,
                    }
                ]

                // check the structure of the selection anction
                expect(selectElements(...selection)).toEqual({
                    type: SELECT_ELEMENTS,
                    payload: selection
                })
            })

            it('clears selection', function() {
                // check the structure of the selection anction
                expect(clearSelection()).toEqual({
                    type: CLEAR_SELECTION,
                })
            })

            it('delete selection', function() {
                // make sure the action has the correct structure
                expect(deleteSelection()).toEqual({
                    type: DELETE_SELECTION,
                })
            })
        })

        describe('Add elements', function() {
            it('is structured appropriately', function() {
                // the elements to add
                const elements = [{type: "anchors", x: 50, y: 100}, {type: "propagators", x: 70, y:100}]
                expect(addElements(...elements)).toEqual({
                    type: ADD_ELEMENTS,
                    payload: elements,
                })
            })

            it('throws an error if adding an element without a type', function() {
                expect(() => addElements({x: 50})).toThrow(Error)
            })
        })

        describe('Other', function() {
            it('merge elements', function() {
                // just check the type of the action
                expect(mergeElements(1)).toEqual({
                    type: MERGE_ELEMENTS,
                    payload: {
                        source: 1,
                        select: false,
                    }
                })
            })

            it('clear elements', function() {
                // just check the type of the action
                expect(clearElements()).toEqual({
                    type: CLEAR_ELEMENTS
                })
            })

            it('merge elements with selection', function() {
                // just check the type of the action
                expect(mergeElements(1, true)).toEqual({
                    type: MERGE_ELEMENTS,
                    payload: {
                        source: 1,
                        select: true,
                    }
                })
            })

            it('place element', function() {
                expect(placeElement({hello:'world'})).toEqual({
                    type: PLACE_ELEMENTS,
                    payload: {
                        hello: "world"
                    }
                })
            })

            it('load pattern', function() {
                // a pattern fixture
                const pattern = {name:"hello"}
                // check the structure of the action
                expect(loadPattern(pattern)).toEqual({
                    type: LOAD_PATTERN,
                    payload: pattern
                })
            })

            it('set single element attrs', function() {
                // the elements to select
                const attr = {
                    id: 2,
                    x: 50,
                }

                // check the structure of the set action
                expect(setElementAttrs(attr)).toEqual({
                    type: SET_ELEMENT_ATTRS,
                    payload: [attr]
                })
            })

            it('set multiple elements attrs', function() {
                // the elements to select
                const attrs = [
                    {
                        id: 1,
                        x: 50,
                    },
                    {
                        id: 2,
                        x: 50,
                    }
                ]

                // check the structure of the set action
                expect(setElementAttrs(...attrs)).toEqual({
                    type: SET_ELEMENT_ATTRS,
                    payload: attrs
                })
            })

            it('can delete single element', function() {
                // the delete payload
                const del = {type: 'anchors', id: 1}
                // test the structure of the action
                expect(deleteElements(del)).toEqual({
                    type: DELETE_ELEMENTS,
                    payload: [del]
                })
            })

            it('can delete multiple elements', function() {
                // the delete payload
                const del = [
                    {type: 'anchors', id: 1},
                    {type: 'anchors', id: 2},
                ]
                // test the structure of the action
                expect(deleteElements(...del)).toEqual({
                    type: DELETE_ELEMENTS,
                    payload: del
                })
            })

            it('move selected anchors', function() {
                // the move order
                const move = {
                    x: 50,
                    y: 50
                }

                expect(moveSelectedElements(move)).toEqual({
                    type: MOVE_SELECTED_ELEMENTS,
                    payload: move,
                })
            })
        })
    })
})
