// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Header, SliderRow, Row, Label, MultiRow, ButtonRow, Container } from '..'
import FermionSummary from './FermionSummary'
import ElectroWeakSummary from './ElectroWeakSummary'
import GluonSummary from './GluonSummary'
import { ColorPicker, Select, Option, RedButton, Input } from 'components'
import { Propagator } from 'interface/Diagram/Propagator'
import { setElementAttrs, deleteElements } from 'actions/elements'
import { withCommit } from 'actions/history'
import styles from './styles'

const PropagatorSummary = ({propagators, setAttrs, elements, deletePropagators, showDelete=true, ...unusedProps}) => {
    // figure out if the entity needs to be pluralized
    const propagator = propagators.length > 1 ? 'propagators' : 'propagator'
    // grab the first values of the group properties
    const strokeWidth = firstValue({propagators, param: 'strokeWidth', elements})
    const stroke = firstValue({propagators, param: 'stroke', elements})
    // assume that there is only one propagator and grab the appropriate summary component
    const head = elements.propagators[propagators[0]]
    // get the appropriate summary for the head
    const ElementSummary = {
        fermion: FermionSummary,
        dashed: FermionSummary,
        em: ElectroWeakSummary,
        gluon: GluonSummary,
    }[head.kind]

    // render the component
    return (
        <Container {...unusedProps}>
            <Header>
                {`${propagators.length} ${propagator} selected`}
            </Header>
            {propagators.length === 1 && (
                <ButtonRow>
                    <Label style={styles.labelLabel}>label:</Label>
                    <Input
                        style={styles.labelInput}
                        value={head.label || ''}
                        onChange={evt =>
                            setAttrs({label: evt.target.value})
                        }
                    />
                </ButtonRow>
            )}
            <Row>
                <Label>color:</Label>
                <ColorPicker
                    style={styles.colorPicker}
                    color={stroke || Propagator.defaultProps.stroke}
                    onChange={stroke => setAttrs({stroke})}
                />
            </Row>
            <SliderRow
                label="size"
                value={strokeWidth || Propagator.defaultProps.strokeWidth}
                onChange={strokeWidth => setAttrs({strokeWidth})}
                min={1}
                max={10}
                step={1}
            />
            {propagators.length === 1 && (
                <MultiRow style={{marginBottom: 0}}>
                    <ButtonRow>
                        <Select
                            value={head.kind}
                            onChange={(event) => setAttrs({kind: event.target.value})}
                            style={styles.select}
                        >
                            <Option value="fermion">fermion</Option>
                            <Option value="dashed">dashed</Option>
                            <Option value="em">electroweak</Option>
                            <Option value="gluon">gluon</Option>
                        </Select>
                    </ButtonRow>
                    {ElementSummary && <ElementSummary setAttrs={setAttrs} {...head}/>}
                </MultiRow>
            )}
            {showDelete && (
                <ButtonRow>
                    <RedButton onClick={deletePropagators} style={styles.button}>
                        delete {propagator}
                    </RedButton>
                </ButtonRow>
            )}
        </Container>
    )
}
const firstValue = ({propagators, param, elements}) => {
    // go over every propagator
    for (const id of propagators) {
        // the fill of the propagator
        const val = elements.propagators[id][param]
        // if the propagator has the attr
        if (val) {
            // use it
            return val
        }
    }
}

const mapDispatchToProps = (dispatch, {propagators}) => ({
    setAttrs: (attrs) => (
        dispatch(setElementAttrs(
            ...propagators.map(id => ({type: 'propagators', id, ...attrs}))
        ))
    ),
    deletePropagators: () => (
        dispatch(withCommit(deleteElements(
            ...propagators.map(id => ({type: 'propagators', id}))
        ), 'removed propagators from diagram'))
    ),
})
const selector = ({diagram: {elements}}) => ({elements})
export default connect(selector, mapDispatchToProps)(PropagatorSummary)
