// local imports
import throttle from '../throttle'

describe('Utils', function() {
    describe('Throttle decorator util', function() {
        it('can throttle a class method', function () {
            // a spy to count invocations
            const spy = sinon.spy()
            
            // a class to test
            class Foo { 
                // create a throttled method
                @throttle(1000)
                decorated() {
                    // call the spy
                     spy()
                }
            }

            // call the method twice
            const foo = new Foo()
            foo.decorated()
            foo.decorated()

            // make sure the spy was only called one
            spy.should.have.been.calledOnce
        })
    })
})
