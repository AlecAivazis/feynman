// local imports
import round from './round'

const fixPositionToGrid = ({x, y}, gridSize) => ({
    x: gridSize === 0 ? x : round(x, gridSize),
    y: gridSize === 0 ? y : round(y, gridSize)
})

export default fixPositionToGrid
