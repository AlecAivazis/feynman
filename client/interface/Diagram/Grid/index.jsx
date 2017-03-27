// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { range, round } from 'utils'
import styles from './styles'
import { sidebarWidth } from 'interface/Sidebar/styles'

const Grid = ({ style, browser, info }) => {
    // the number of vertical grid lines (add one to cover the remainder)
    const nVertical = (Math.floor((browser.width - sidebarWidth) / info.gridSize) + 1) / info.zoomLevel
    // the number of horizontal lines (add one to cover the remainder)
    const nHorizontal = (Math.floor(browser.height / info.gridSize) + 1) / info.zoomLevel

    // the 4 edges of the grid
    const topEdge = (browser.height + info.gridSize - info.pan.y) / info.zoomLevel
    const bottomEdge = (-info.gridSize - info.pan.y) / info.zoomLevel
    const leftEdge = (-info.gridSize - info.pan.x) / info.zoomLevel
    const rightEdge = (browser.width + info.gridSize - info.pan.x) / info.zoomLevel

    // className is used to remove it during png export
    return (
        <g {...{...styles.container, ...style}} className="grid">
            {range(nVertical).map(i => {
                // the shared x coordinate of the vertical lines
                const x = round(leftEdge + i * info.gridSize, info.gridSize)
                // render the line
                return (
                    <path
                        {...styles.gridLine}
                        key={`${x} ${bottomEdge} - ${ i }`}
                        d={`M ${x} ${bottomEdge} L ${x} ${topEdge}`}
                    />
            )})}
            {range(nHorizontal).map(i => {
                // the shared y coordinate of the horizontal lines
                const y = round(bottomEdge + i * info.gridSize, info.gridSize)
                // render the line
                return (
                    <path
                        {...styles.gridLine}
                        key={`${leftEdge} ${y} - ${i}`}
                        d={`M ${leftEdge} ${y}  L ${rightEdge} ${y} `}
                    />
            )})}
        </g>
    )
}

const selector = ({diagram: {info}, browser}) => ({info, browser})
export default connect(selector)(Grid)
