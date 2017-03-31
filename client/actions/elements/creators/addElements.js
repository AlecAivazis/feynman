// local imports
import { ADD_ELEMENTS } from 'actions/elements'

export default (...configs) => {
    // if there are any configs without a type
    if (configs.filter(({type}) => !type).length > 0)  {
        throw new Error("Cannot add element without type")
    }

    return {
        type: ADD_ELEMENTS,
        payload: configs,
    }
}
