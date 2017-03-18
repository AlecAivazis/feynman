// local imports
import infoReducer from './info'
import elementsReducer from './elements'

const initialState = {
    elements: {},
    info: {}
}

export default (state = initialState, action) => {

    return {
        elements: elementsReducer(state.elements, action),
        info: infoReducer(state.info, action)
    }
}
