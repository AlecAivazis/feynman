// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Collapsible } from 'components'
import { toggleHistory } from 'actions/info'
import styles from './styles'

const HistorySummary = ({info, history, dispatch, toggle, style}) => (
    <Collapsible title="History" active={info.showHistory} style={style} toggle={toggle}>
        <div style={styles.container}>
            this is not implemented yet
        </div>
    </Collapsible>
)

const selector = ({diagram: { info, elements: { history } }}) => ({info, history})
const mapDispatchToProps = dispatch => ({
    toggle: () => dispatch(toggleHistory())
})
export default connect(selector, mapDispatchToProps)(HistorySummary)
