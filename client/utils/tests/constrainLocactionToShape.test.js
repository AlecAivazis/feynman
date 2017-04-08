// local imports
import constrainLocactionToShape from '../constrainLocationToShape'

describe('Utils', function() {
    describe('Constrain Location to Shape', function() {
        it('constrains locaction to circle', function () {
           // the shape to constraint it to
           const shape = {
               kind: "parton",
               r: 50,
               x: 50,
               y: 50,
           }

           // the location to constrain
           const location = {
               x: 105,
               y: 50,
           }

            expect(constrainLocactionToShape({shape, location})).toEqual({
                x: 100,
                y: 50,
            })
        })
    })
})
