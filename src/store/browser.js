// external imports
import { createResponsiveStateReducer } from 'redux-responsive'

// create a reducer that is aware of the height and width of the browser
const reducer = createResponsiveStateReducer(null, {
    extraFields: () => ({
        width: window.innerWidth,
        height: window.innerHeight,
    })
})

export default reducer
