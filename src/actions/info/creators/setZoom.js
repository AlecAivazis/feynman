// local imports
import { SET_ZOOM } from 'actions/info/types'

export default (level) => ({
    type: SET_ZOOM,
    payload: level,
})
