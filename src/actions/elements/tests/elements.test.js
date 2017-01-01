// local imports
import { selectElements, SELECT_ELEMENTS } from 'actions/elements'

describe('Action Creators', function() {
    describe('Elements', function() {
        describe('Select Elements', function() {
            it('single element', function() {
                // the elements to select
                const selection = {
                    type: 'anchor',
                    id: 1,
                }

                // check the structure of the selection anction
                expect(selectElements(selection)).to.deep.equal({
                    type: SELECT_ELEMENTS,
                    payload: [selection]
                })
            })

            it('mulitple elements', function() {
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
                expect(selectElements(...selection)).to.deep.equal({
                    type: SELECT_ELEMENTS,
                    payload: selection
                })
            })
        })
    })
})
