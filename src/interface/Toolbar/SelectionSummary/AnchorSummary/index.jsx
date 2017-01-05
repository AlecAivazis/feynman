// external imports
import React from 'react'
// local imports
import styles from './styles'
import Header from '../Header'
import Label from '../Label'

const AnchorSummary = ({ style, anchors, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        <Header>
            {`${anchors.length} anchor${anchors.length > 1 ? 's' : ''} selected`}
        </Header>
        <Label>color:</Label>
        <Label>size:</Label>

    </div>
)

export default AnchorSummary
