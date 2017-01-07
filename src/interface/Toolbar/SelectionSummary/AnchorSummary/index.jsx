// external imports
import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
// local imports
import styles from './styles'
import Header from '../Header'
import Label from '../Label'
import { ColorPicker, Slider, Button, ToggleButton } from 'components'
import { setElementAttrs, deleteElements } from 'actions/elements'

const AnchorSummary = ({
    style,
    anchors,
    setAttrs,
    elements,
    deleteAnchors,
    ...unusedProps
}) => {
    // figur eout if anchor needs to be pluralized
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
            <div style={styles.row}>
                <Label>color:</Label>
                <ColorPicker
                    color={fill || 'black'}
                    style={styles.picker}
                    onChange={fill => setAttrs({fill})}
                />
            </div>
            <div style={styles.multiRow}>
                <div style={{...styles.row, marginBottom: 0}}>
                    <Label>size:</Label>
                    <div style={styles.value}
                        dangerouslySetInnerHTML={{
                            __html: r || '&mdash;'
                        }}
                    />
                </div>
                <div style={{...styles.row, ...styles.sliderRow}}>
                    <Slider
                        value={firstValue({param: 'r', anchors, elements})}
                        min={1}
                        max={10}
                        step={1}
                        onChange={r => setAttrs({r})}
                    />
                </div>
            </div>

            {/* single anchor actions only */}

            {anchors.length === 1 && (
                <div style={{...styles.row, ...styles.buttonRow}}>
                    <ToggleButton
                        onClick={() => setAttrs({fixed: !fixed})}
                        style={styles.fixButton}
                        active={fixed}
                        inactiveText="Fix anchor to canvas"
                        activeText="Unfix anchor from canvas"
                    />
                </div>
            )}

            {/* multiple anchor actions only */}

            {/* make sure delete is at the end */}

            <div style={{...styles.row, ...styles.buttonRow}}>
                <Button onClick={deleteAnchors} style={styles.deleteButton}>
                    delete {anchor}
                </Button>
            </div>
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
})

// the anchor summary needs the elements object
const selector = ({ elements }) => ({ elements })
export default connect(selector, mapDispatchToProps)(AnchorSummary)
