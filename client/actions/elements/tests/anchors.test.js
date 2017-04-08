// local imports
import { addAnchors, setAnchorLocations, alignSelectedAnchors } from '../creators'
import { ADD_ANCHORS, SET_ANCHOR_LOCATIONS, ALIGN_SELECTED_ANCHORS } from '../types'

// a stub for an empty getState
const emptyState = jest.fn().mockReturnValue({
    elements: {
        anchors: []
    }
})

describe('Action Creators', () => {
    describe('Elements', () => {
        describe('Anchors', () => {
            test('add single anchor', () => {
                // the configuration for the anchor to add
                const anchor = {
                    id: 1,
                    x: 50,
                    y: 100
                }

                // make sure dispatch was called with the appropriate body
                expect(addAnchors(anchor)).toEqual({
                    type: ADD_ANCHORS,
                    payload: [anchor]
                })
            })

            test('add multiple anchors', () => {
                // the configuration for the anchor to add
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100
                    },
                    {
                        id: 2,
                        x: 50,
                        y: 100
                    }
                ]

                // make sure dispatch was called with the appropriate body
                expect(addAnchors(...anchors)).toEqual({
                    type: ADD_ANCHORS,
                    payload: anchors
                })
            })

            test('set single anchor location', () => {
                // the configuration for the anchor to add
                const anchor = {
                    id: 1,
                    x: 50,
                    y: 100
                }

                // make sure dispatch was called with the appropriate body
                expect(setAnchorLocations(anchor)).toEqual({
                    type: SET_ANCHOR_LOCATIONS,
                    payload: [anchor]
                })
            })

            test('set multiple anchor locations', () => {
                // the configuration for the anchor to add
                const anchors = [
                    {
                        id: 1,
                        x: 50,
                        y: 100
                    },
                    {
                        id: 2,
                        x: 50,
                        y: 100
                    }
                ]

                // make sure dispatch was called with the appropriate body
                expect(setAnchorLocations(...anchors)).toEqual({
                    type: SET_ANCHOR_LOCATIONS,
                    payload: anchors
                })
            })

            test('align selected anchors', () => {
                expect(alignSelectedAnchors('vertical')).toEqual({
                    type: ALIGN_SELECTED_ANCHORS,
                    payload: 'vertical',
                })
            })
        })
    })
})
