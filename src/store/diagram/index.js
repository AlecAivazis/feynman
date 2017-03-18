// local imports
import infoReducer from './info'
import elementsReducer from './elements'

const initialState = {}

export default (state = initialState, action) => {

    return {
        elements: elementsReducer(state.elements, action),
        info: infoReducer(state.info, action)
    }
}
