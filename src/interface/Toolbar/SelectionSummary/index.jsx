// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import styles from './styles'
import AnchorSummary from './AnchorSummary'
import PropagatorSummary from './PropagatorSummary'

const SelectionSummary = ({ style, selection, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         {(selection.anchors || []).length > 0
            && <AnchorSummary anchors={selection.anchors} />}
         {(selection.propagators || []).length > 0
            && <PropagatorSummary propagators={selection.propagators} />}
    </div>
)

export default SelectionSummary

// local exports for convinience
export MultiRow from './MultiRow'
export SliderRow from './SliderRow'
export Row from './Row'
export Label from './Label'
export Header from './Header'
export ButtonRow from './ButtonRow'
