// external imports
import { saveAs } from 'file-saver'
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

    // remove the history from the elements
    Reflect.deleteProperty(elements, 'history')
    Reflect.deleteProperty(elements, 'selection')

    // save the diagram as a json file
    saveAs(new Blob([JSON.stringify({ title, elements })]), `${title}.json`)
}
