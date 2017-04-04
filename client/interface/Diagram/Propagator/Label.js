// external imports
import React from 'react'
import autobind from 'autobind-decorator'
// local imports
import { Text, MouseMove } from 'components'

class PropagatorLabel extends React.Component {
    render() {
        const {x, y, children, id} = this.props

        return (
            <MouseMove move={this._mouseMove}>
                <Text x={x} y={y}>
                    {children}
                </Text>
            </MouseMove>
        )
    }

    @autobind
    _mouseMove({origin, delta}){
       console.log("moving", origin, delta)
    }
}

export default PropagatorLabel
