// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { range } from 'utils'
import styles from './styles'
import { sidebarWidth } from 'interface/Sidebar/styles'

const Grid = ({ style, browser, info, ...unusedProps }) => {
    // the number of vertical grid lines
    const nVertical = Math.floor((browser.width - sidebarWidth) / info.gridSize)*info.gridSize
    // the number of horizontal lines
    const nHorizontal = Math.floor(browser.height / info.gridSize)*info.gridSize

    // render the actual dom structure
    return (
        <g {...{...styles.container, ...style}}>
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

const selector = ({info, browser}) => ({info, browser})
export default connect(selector)(Grid)
