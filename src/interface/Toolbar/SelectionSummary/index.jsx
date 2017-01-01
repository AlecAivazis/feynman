// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import styles from './styles'
import AnchorSummary from './AnchorSummary'

const SelectionSummary = ({ style, selection, ...unusedProps }) => {
    // group the selection by type
    const selectedItems = _.groupBy(selection, 'type')

    return (
        <div style={{...styles.container, ...style}} {...unusedProps}>
             {selectedItems.anchors.length > 0 && <AnchorSummary anchors={selectedItems.anchors} />}
        </div>
    )
}

export default SelectionSummary
