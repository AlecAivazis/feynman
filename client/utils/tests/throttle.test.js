// local imports
import throttle from '../throttle'

describe('Utils', () => {
    describe('Throttle decorator util', () => {
        test('can throttle a class method', () => {
            // a spy to count invocations
            const spy = jest.fn()

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
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
