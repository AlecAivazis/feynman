// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import styles from './styles'
import AnchorSummary from './AnchorSummary'

const SelectionSummary = ({ style, selection, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         {(selection.anchors || []).length > 0
            && <AnchorSummary anchors={selection.anchors} />}
    </div>
)

export default SelectionSummary
