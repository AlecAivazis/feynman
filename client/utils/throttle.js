// external imports
import _ from 'lodash'

export default throttle => (target, nam, descriptor) => {
    // created a throttled version of the 
    const decorated = _.throttle(descriptor.value, throttle)

    // overwrite the function called by the descriptor
    descriptor.value = decorated
    // we are done modifying the descriptor
    return descriptor
}
