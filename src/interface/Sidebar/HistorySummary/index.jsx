// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Collapsible } from 'components'
import styles from './styles'

const HistorySummary = ({info, dispatch, style}) => (
    <Collapsible title="History" active={info.showHistory} style={style}>
        <div style={styles.container}>
            this is not implemented yet
        </div>
    </Collapsible>
)

const selector = ({diagram: { info }}) => ({info})
export default connect(selector)(HistorySummary)
