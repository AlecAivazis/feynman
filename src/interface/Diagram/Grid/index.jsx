// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { range } from 'utils'
import styles from './styles'
import { sidebarWidth } from 'interface/Sidebar/styles'

const Grid = ({ style, browser, info }) => {
    // the number of vertical grid lines (add one to cover the remainder)
    const nVertical = Math.floor((browser.width - sidebarWidth) / info.gridSize) + 1
    // the number of horizontal lines (add one to cover the remainder)
    const nHorizontal = Math.floor(browser.height / info.gridSize) + 1

    // className is used to remove it during png export
    return (
        <g {...{...styles.container, ...style}} className="grid">
            {range(nVertical).map(i => (
                <path
                    {...styles.gridLine}
                    key={`${i*info.gridSize} -50`}
                    d={`M ${i*info.gridSize} -50 L ${i*info.gridSize} ${browser.height}`}
                />
            ))}
            {range(nHorizontal).map(i => (
                <path
                    {...styles.gridLine}
                    key={`-50 ${i*info.gridSize}`}
                    d={`M -50 ${i*info.gridSize}  L ${browser.width} ${i*info.gridSize} `}
                />
            ))}
        </g>
    )
}

const selector = ({diagram: {info}, browser}) => ({info, browser})
export default connect(selector)(Grid)
