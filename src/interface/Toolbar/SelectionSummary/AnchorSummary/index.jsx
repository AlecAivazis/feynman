// external imports
import React from 'react'
// local imports
import styles from './styles'

const AnchorSummary = ({ style, anchors, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         anchor summary
    </div>
)

export default AnchorSummary
