// external imports
import React from 'react'
// local imports
import styles from './styles'

const SelectionSummaryLabel = ({ style, children, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        {children}
    </div>
)

export default SelectionSummaryLabel
