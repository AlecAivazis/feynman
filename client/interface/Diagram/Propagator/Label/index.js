// external imports
import React from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
// local imports
import { Text, MouseMove } from 'components'
import { relativePosition } from 'utils'
import { setElementAttrs } from 'actions/elements'
import relPosition from './relLocForLabel'
import locationForLabel from './locationForLabel'

class PropagatorLabel extends React.Component {
    render() {
        // grab the used props
        const { children, id, location, distance, element } = this.props

        // compute the location for the labels
        const { x, y } = locationForLabel({ ...element, location, distance })

        return (
            <MouseMove move={this._mouseMove} round={false}>
                <Text x={x} y={y} math={true}>
                    {children}
                </Text>
            </MouseMove>
        )
    }

    @autobind
    _mouseMove({ next }) {
        // this is called whenever the label is being dragged
        // we need to convert the mouse's location in diagram space
        const mouse = relativePosition(next, this.props.info)
        // compute the new relative location for the label
        const labelLoc = relPosition(mouse, this.props.element)
        // update the locations of the label
        this.props.setAttrs(labelLoc)
    }
}

const selector = ({ diagram: { info } }) => ({ info })
const mapDispatchToProps = (dispatch, { element }) => ({
    setAttrs: attrs =>
        dispatch(
            setElementAttrs({
                type: 'propagators',
                id: element.id,
                ...attrs,
            })
        ),
})

export default connect(selector, mapDispatchToProps)(PropagatorLabel)
