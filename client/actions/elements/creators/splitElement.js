// local imports
import { SPLIT_ELEMENT } from 'actions/elements'

export default ({element, location}) => ({
    type: SPLIT_ELEMENT,
    payload: {element, location},
})
