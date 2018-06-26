// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import { setElementAttrs, deleteSelection } from 'actions/elements'
import { withCommit, commit } from 'actions/history'
import { ButtonRow, Row, Label, Header, Container } from '..'
import { Input, RedButton } from 'components'

const TextSummary = ({ text, deleteElement, elements, setValue, showDelete, commit, ...unused }) => {
    // a potentially pluralized version of the type
    const textPlural = text.length > 1 ? 'texts' : 'text'

    return (
        <Container {...unused}>
            <Header>{`${text.length} ${textPlural} selected`}</Header>
            {text.map(id => {
                // grab the value from the appropriate element
                const { value } = elements.text[id]

                return (
                    <Row key={id}>
                        <Input
                            style={styles.input}
                            value={value}
                            onChange={evt => {
                                setValue(id, evt.target.value)
                            }}
                            onFinish={val => commit(`changed text value to ${val}`)}
                        />
                    </Row>
                )
            })}
            {showDelete && (
                <ButtonRow>
                    <RedButton onClick={deleteElement}>{`Delete ${textPlural}`}</RedButton>
                </ButtonRow>
            )}
        </Container>
    )
}

const selector = ({ diagram: { elements } }) => ({ elements })
const mapDispatchToProps = dispatch => ({
    setValue: (id, value) => dispatch(setElementAttrs({ type: 'text', id, value })),
    deleteElement: () => dispatch(withCommit(deleteSelection(), 'removed text from diagram')),
    commit: msg => dispatch(commit(msg)),
})

export default connect(selector, mapDispatchToProps)(TextSummary)
