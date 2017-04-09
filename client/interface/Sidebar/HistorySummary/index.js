// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Collapsible } from 'components'
import { toggleHistory } from 'actions/info'
import { goto } from 'actions/history'
import styles from './styles'

const HistorySummary = ({info, history, dispatch, toggle, goTo, style}) => (
    <Collapsible title="History" active={info.showHistory} style={style} toggle={toggle}>
        <div style={styles.container}>
            {history.get('log').toJS().map((entry, index) => (
                <div
                    onClick={() => goTo(index)}
                    style={index === history.get('head') ? styles.selectedEntry : styles.historyEntry}
                    key={index}
                >
                    <div style={styles.historyIndex}>
                        {history.get('log').size - index} :
                    </div>
                    <div style={styles.historyMessage}>
                        {` ${entry['message']}`}
                    </div>
                </div>
            ))}
        </div>
    </Collapsible>
)

const selector = ({diagram: { info, elements: { history } }}) => ({info, history})
const mapDispatchToProps = dispatch => ({
    toggle: () => dispatch(toggleHistory()),
    goTo: i => dispatch(goto(i)),
})
export default connect(selector, mapDispatchToProps)(HistorySummary)
