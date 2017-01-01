// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import SelectionSummary from './SelectionSummary'

const Toolbar = ({style, selection, ...unusedProps}) => (
    <div style={{...styles.container, ...style}}>
        {selection.length > 0 && <SelectionSummary selection={selection}/>}
        {selection.length == 0 && 'empty'}
    </div>
)

const selector = ({elements}) => ({selection: elements.selection})
export default connect(selector)(Toolbar)
