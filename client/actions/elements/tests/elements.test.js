// local imports
import {
    selectElements,
    SELECT_ELEMENTS,
    clearSelection,
    CLEAR_SELECTION,
    mergeElements,
    MERGE_ELEMENTS,
    setElementAttrs,
    SET_ELEMENT_ATTRS,
    deleteElements,
    DELETE_ELEMENTS,
    moveSelectedElements,
    MOVE_SELECTED_ELEMENTS,
    clearElements,
    CLEAR_ELEMENTS,
    deleteSelection,
    DELETE_SELECTION,
    placeElement,
    PLACE_ELEMENTS,
    loadPattern,
    LOAD_PATTERN,
    addElements,
    ADD_ELEMENTS,
    splitElement,
    SPLIT_ELEMENT,
    snapSelectedElements,
    SNAP_SELECTED_ELEMENTS,
    exportDiagram,
} from 'actions/elements'

describe('Action Creators', () => {
    describe('Elements', () => {
        describe('Selection', () => {
            test('select single element', () => {
                // the elements to select
                const selection = {
                    type: 'anchor',
                    id: 1,
                }

                // check the structure of the selection anction
                expect(selectElements(selection)).toEqual({
                    type: SELECT_ELEMENTS,
                    payload: [selection],
                })
            })

            test('select mulitple elements', () => {
                // the elements to select
                const selection = [
                    {
                        type: 'anchor',
                        id: 1,
                    },
                    {
                        type: 'anchor',
                        id: 2,
                    },
                ]

                // check the structure of the selection anction
                expect(selectElements(...selection)).toEqual({
                    type: SELECT_ELEMENTS,
                    payload: selection,
                })
            })

            test('clears selection', () => {
                // check the structure of the selection anction
                expect(clearSelection()).toEqual({
                    type: CLEAR_SELECTION,
                })
            })

            test('delete selection', () => {
                // make sure the action has the correct structure
                expect(deleteSelection()).toEqual({
                    type: DELETE_SELECTION,
                })
            })
        })

        describe('Add elements', () => {
            test('is structured appropriately', () => {
                // the elements to add
                const elements = [{ type: 'anchors', x: 50, y: 100 }, { type: 'propagators', x: 70, y: 100 }]
                expect(addElements(...elements)).toEqual({
                    type: ADD_ELEMENTS,
                    payload: elements,
                })
            })

            test('throws an error if adding an element without a type', () => {
                expect(() => addElements({ x: 50 })).toThrow(Error)
            })
        })

        describe('Other', () => {
            test('merge elements', () => {
                // just check the type of the action
                expect(mergeElements(1)).toEqual({
                    type: MERGE_ELEMENTS,
                    payload: {
                        source: 1,
                        select: false,
                    },
                })
            })

            test('snap selected elements', () => {
                // just check the type of the action
                expect(snapSelectedElements()).toEqual({
                    type: SNAP_SELECTED_ELEMENTS,
                })
            })

            test('clear elements', () => {
                // just check the type of the action
                expect(clearElements()).toEqual({
                    type: CLEAR_ELEMENTS,
                })
            })

            test('split element', () => {
                const element = { id: 1, x: 50, y: 50 }
                const location = { x: 50, y: 50 }

                // just check the type of the action
                expect(splitElement({ element, location })).toEqual({
                    type: SPLIT_ELEMENT,
                    payload: { element, location },
                })
            })

            test('merge elements with selection', () => {
                // just check the type of the action
                expect(mergeElements(1, true)).toEqual({
                    type: MERGE_ELEMENTS,
                    payload: {
                        source: 1,
                        select: true,
                    },
                })
            })

            test('place element', () => {
                expect(placeElement({ hello: 'world' })).toEqual({
                    type: PLACE_ELEMENTS,
                    payload: {
                        hello: 'world',
                    },
                })
            })

            test('load pattern', () => {
                // a pattern fixture
                const pattern = { name: 'hello' }
                // check the structure of the action
                expect(loadPattern(pattern)).toEqual({
                    type: LOAD_PATTERN,
                    payload: pattern,
                })
            })

            test('set single element attrs', () => {
                // the elements to select
                const attr = {
                    id: 2,
                    x: 50,
                }

                // check the structure of the set action
                expect(setElementAttrs(attr)).toEqual({
                    type: SET_ELEMENT_ATTRS,
                    payload: [attr],
                })
            })

            test('set multiple elements attrs', () => {
                // the elements to select
                const attrs = [
                    {
                        id: 1,
                        x: 50,
                    },
                    {
                        id: 2,
                        x: 50,
                    },
                ]

                // check the structure of the set action
                expect(setElementAttrs(...attrs)).toEqual({
                    type: SET_ELEMENT_ATTRS,
                    payload: attrs,
                })
            })

            test('can delete single element', () => {
                // the delete payload
                const del = { type: 'anchors', id: 1 }
                // test the structure of the action
                expect(deleteElements(del)).toEqual({
                    type: DELETE_ELEMENTS,
                    payload: [del],
                })
            })

            test('can delete multiple elements', () => {
                // the delete payload
                const del = [{ type: 'anchors', id: 1 }, { type: 'anchors', id: 2 }]
                // test the structure of the action
                expect(deleteElements(...del)).toEqual({
                    type: DELETE_ELEMENTS,
                    payload: del,
                })
            })

            test('move selected anchors', () => {
                // the move order
                const move = {
                    x: 50,
                    y: 50,
                }

                expect(moveSelectedElements(move)).toEqual({
                    type: MOVE_SELECTED_ELEMENTS,
                    payload: move,
                })
            })

            test('export diagram', () => {
                // mock some state out
                const getState = () => ({
                    diagram: {
                        info: { title: 'hello world' },
                        elements: {
                            anchors: {
                                1: { x: 50, y: 50 },
                            },
                        },
                    },
                })

                // and a mocked dispatch
                const dispatch = jest.fn()

                // invoke the thunked action
                const thunk = exportDiagram()(dispatch, getState)
            })
        })
    })
})
