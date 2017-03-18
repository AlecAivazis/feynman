// external imports
import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
// local imports
import styles from './styles'
import { MultiRow, SliderRow, ButtonRow, Row, Label, Header } from '..'
import { ColorPicker, Button, ToggleButton, RedButton } from 'components'
import { setElementAttrs, deleteElements, alignSelectedAnchors } from 'actions/elements'

const AnchorSummary = ({
    style,
    anchors,
    setAttrs,
    elements,
    deleteAnchors,
    alignAnchors,
    showDelete=true,
    ...unusedProps
}) => {
    // figure out if anchor needs to be pluralized
    const anchor = anchors.length > 1 ? 'anchors' : 'anchor'

    // the values to show in the summary
    const fill = firstValue({param: 'fill', anchors, elements})
    const r = firstValue({param: 'r', anchors, elements})
    const fixed = firstValue({param: 'fixed', anchors, elements})

    return (
        <div style={{...styles.container, ...style}} {...unusedProps}>
            <Header>
                {`${anchors.length} ${anchor} selected`}
            </Header>
            <Row>
                <Label>color:</Label>
                <ColorPicker
                    style={styles.colorPicker}
                    color={fill || 'black'}
                    onChange={fill => setAttrs({fill})}
                />
            </Row>
            <SliderRow
                label="size"
                value={r}
                onChange={r => setAttrs({r})}
                min={1}
                max={10}
                step={1}
            />

            {anchors.length === 1 && (
                <ButtonRow>
                    <ToggleButton
                        onClick={() => setAttrs({fixed: !fixed})}
                        style={styles.fixButton}
                        active={fixed}
                        inactiveText={`Pin ${anchor}`}
                        activeText={`Unpin ${anchor}`}
                    />
                </ButtonRow>
            )}

            {anchors.length > 1 && (
                <div style={{width: '100%', display: 'flex', flexDirection: 'column',}}>
                    <ButtonRow>
                        <Button onClick={alignAnchors('horizontal')} style={styles.alignButton}>
                            Align horizontally
                        </Button>
                    </ButtonRow>

                    <ButtonRow>
                        <Button onClick={alignAnchors('vertical')} style={styles.alignButton}>
                            Align vertically
                        </Button>
                    </ButtonRow>
                </div>
            )}

            {showDelete && (
                <ButtonRow>
                    <RedButton onClick={deleteAnchors} style={styles.deleteButton}>
                        delete {anchor}
                    </RedButton>
                </ButtonRow>
            )}
        </div>
    )
}

const firstValue = ({anchors, param, elements}) => {
    // go over every anchor
    for (const id of anchors) {
        // the fill of the anchor
        const val = elements.anchors[id][param]
        // if the anchor has a fill
        if (val) {
            // use it
            return val
        }
    }
}

// the anchor summary needs
const mapDispatchToProps = (dispatch, {anchors}) => ({
    // to update the attributes of each anchor that is selected
    setAttrs: attrs => (
        dispatch(setElementAttrs(
            ...anchors.map(id => ({type: 'anchors', id, ...attrs}))
        ))
    ),
    deleteAnchors: () => (
        dispatch(deleteElements(
            ...anchors.map(id => ({type: 'anchors', id}))
        ))
    ),
    alignAnchors: dir => () => (
        dispatch(alignSelectedAnchors(dir))
    )
})

// the anchor summary needs the elements object
const selector = ({diagram: { elements }}) => ({ elements })
export default connect(selector, mapDispatchToProps)(AnchorSummary)
