// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Collapsible } from 'components'
import { toggleHistory } from 'actions/info'
import { goto } from 'actions/history'
import styles from './styles'
import Entry from './Entry'

const HistorySummary = ({ info, history, toggle, goTo, style }) => (
    <Collapsible title="History" active={info.showHistory} style={style} toggle={toggle}>
        <div style={styles.container}>
            {history
                .get('log')
                .toJS()
                .map((entry, index) => (
                    <Entry
                        onClick={() => goTo(index)}
                        active={index === history.get('head')}
                        length={history.get('log').size}
                        index={index}
                        key={index}
                    >
                        {entry}
                    </Entry>
                ))}
        </div>
    </Collapsible>
)

const selector = ({ diagram: { info, elements: { history } } }) => ({ info, history })
const mapDispatchToProps = dispatch => ({
    toggle: () => dispatch(toggleHistory()),
    goTo: i => dispatch(goto(i)),
})
export default connect(selector, mapDispatchToProps)(HistorySummary)
