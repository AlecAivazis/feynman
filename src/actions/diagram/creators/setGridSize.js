// local imports
import { SET_GRID_SIZE } from 'actions/diagram/types'

export default size => ({
    type: SET_GRID_SIZE,
    payload: size,
})
