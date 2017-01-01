// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'

const SelectionSummary = ({ style, selection, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
         {JSON.stringify(selection)}
    </div>
)

export default SelectionSummary
