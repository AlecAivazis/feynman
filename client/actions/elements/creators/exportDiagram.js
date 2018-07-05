// local imports
import { EXPORT_DIAGRAM } from 'actions/elements'

export default () => (dispatch, getState) => {
    // grab the information we want to persist
    const {
        diagram: {
            info: { title },
            elements,
        },
    } = getState()

    // the stringified state
    const state = JSON.stringify({ title, elements }, 4)

    console.log(state)
}
