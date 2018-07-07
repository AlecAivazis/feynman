// external imports
import { saveAs } from 'file-saver'
import _ from 'lodash'
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

    const diagramElements = _.cloneDeep(elements)

    // remove the history from the elements
    Reflect.deleteProperty(diagramElements, 'history')
    Reflect.deleteProperty(diagramElements, 'selection')

    // save the diagram as a json file
    saveAs(
        new Blob([
            JSON.stringify({
                title,
                elements: diagramElements,
            }),
        ]),
        `${title}.json`
    )
}
