// external imports
import sinon from 'sinon'
// local imports
import { addAnchors } from '../creators'
import { ADD_ANCHORS } from '../types'

// a stub for an empty getState
const emptyState = sinon.stub().returns({
    elements: {
        anchors: []
    }
})

describe('Action Creators', function() {
    describe('Elements', function() {
        describe('Anchors', function() {
            it('add single anchor', function() {
                // the configuration for the anchor to add
                const anchor = {
                    id: 1,
                    x: 50,
                    y: 100
                }

                // make sure dispatch was called with the appropriate body
                expect(addAnchors(anchor)).to.deep.equal({
                    type: ADD_ANCHORS,
                    payload: [anchor]
                })

            })

            it('add multiple anchors', function() {
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
                expect(addAnchors(...anchors)).to.deep.equal({
                    type: ADD_ANCHORS,
                    payload: anchors
                })

            })
        })
    })
})