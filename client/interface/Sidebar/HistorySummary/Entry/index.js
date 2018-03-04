// external imports
import React from 'react'
// local imports
import styles from './styles'

const HistorySummaryEntry = ({ children, index, length, active, ...unused }) => (
    <div style={active ? styles.active : styles.container} {...unused}>
        <div style={styles.index}>{length - index} :</div>
        <div style={styles.message}>{` ${children.message}`}</div>
    </div>
)

export default HistorySummaryEntry
