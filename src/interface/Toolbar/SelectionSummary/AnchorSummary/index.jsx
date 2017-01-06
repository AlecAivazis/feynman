// external imports
import React from 'react'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
// local imports
import styles from './styles'
import Header from '../Header'
import Label from '../Label'
import { ColorPicker } from 'components'
import { setElementAttrs } from 'actions/elements'

const firstColor = ({anchors, elements}) => {

    // go over every anchor
    for (const {id} of anchors) {
        // the fill of the anchor
        const { fill } = elements.anchors[id]
        // if the anchor has a fill
        if (fill) {
            // use it
            return fill
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
                color={firstColor({anchors, elements}) || 'black'}
                style={styles.picker}
                onChange={fill => setAttrs({fill})}
            />
        </div>
        <div style={styles.row}>
            <Label>size:</Label>
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
