// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Shape } from 'interface/Diagram/Shape'
import { ColorPicker } from 'components'
import { setElementAttrs } from 'actions/elements'
import { commit } from 'actions/history'
import { Container, Label, Header, Row, SliderRow } from '..'
import styles from './styles'

const ShapeSummary = ({ shapes, elements, setAttrs, commit }) => {
    // a potentially pluralized version of the type
    const shapePlural = shapes.length > 1 ? 'shapes' : 'shape'

    // get the head of the selection and use that as values for the controls
    const head = elements.shapes[shapes[0]]

    return (
        <Container>
            <Header>{`${shapes.length} ${shapePlural} selected`}</Header>
            <Row>
                <Label>color:</Label>
                <ColorPicker
                    color={head.color || Shape.defaultProps.color}
                    style={styles.colorPicker}
                    onChange={color => setAttrs({ color }, `changed shape color to ${color}`)}
                />
            </Row>
            <SliderRow
                label="radius"
                value={head.r || Shape.defaultProps.r}
                min={5}
                max={50}
                step={5}
                onChange={r => setAttrs({ r })}
                onAfterChange={r => commit(`changed shape radius to ${r}`)}
            />
        </Container>
    )
}

const selector = ({ diagram: { elements } }) => ({ elements })
const mapDispatchToProps = (dispatch, { shapes }) => ({
    // to update the attributes of each anchor that is selected
    setAttrs: (attrs, msg) => {
        dispatch(setElementAttrs(...shapes.map(id => ({ type: 'shapes', id, ...attrs }))))
        if (msg) {
            dispatch(commit(msg))
        }
    },
    commit: msg => dispatch(commit(msg)),
})
export default connect(selector, mapDispatchToProps)(ShapeSummary)
