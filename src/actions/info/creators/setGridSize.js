// local imports
import { SET_GRID_SIZE } from 'actions/info/types'

export default size => ({
    type: SET_GRID_SIZE,
    payload: size,
})
