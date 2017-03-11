// local imports
import { sidebarWidth } from 'interface/Sidebar/styles'

// this function takes coordinates in the browser, and returns their location relative
// to the upper left corner of the diagram
const relativePosition = ({x, y}) => ({
    x: x - sidebarWidth,
    y
})

export default relativePosition