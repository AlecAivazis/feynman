// external imports
import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
// local imports
import styles from './styles'
import Header from '../Header'
import Label from '../Label'
import { ColorPicker, Slider } from 'components'
import { setElementAttrs } from 'actions/elements'

const firstValue = ({anchors, param, elements}) => {
    // go over every anchor
    for (const {id} of anchors) {
        // the fill of the anchor
        const val = elements.anchors[id][param]
        // if the anchor has a fill
        if (val) {
            // use it
            return val
        }
    }
}


const AnchorSummary = ({ style, anchors, setAttrs, elements, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        <Header>
            {`${anchors.length} anchor${anchors.length > 1 ? 's' : ''} selected`}
        </Header>
        <div style={styles.row}>
            <Label>color:</Label>
            <ColorPicker
                color={firstValue({param: 'fill', anchors, elements}) || 'black'}
                style={styles.picker}
                onChange={fill => setAttrs({fill})}
            />
        </div>
        <div style={styles.multiRow}>
            <div style={{...styles.row, marginBottom: 0}}>
                <Label>size:</Label>
                <div style={styles.value}
                    dangerouslySetInnerHTML={{
                        __html: firstValue({param: 'r', anchors, elements}) || '&mdash;'
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
    </div>
)

// the anchor summary needs
const mapDispatchToProps = (dispatch, props) => ({
    // to update the attributes of each anchor that is selected
    setAttrs: attrs => (
        dispatch(setElementAttrs(
            ...props.anchors.map(({id}) => ({type: 'anchors', id, ...attrs}))
        ))
    ),
})

// the anchor summary needs the elements object
const selector = ({ elements }) => ({ elements })
export default connect(selector, mapDispatchToProps)(AnchorSummary)
