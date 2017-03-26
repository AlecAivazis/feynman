// external imports
import React from 'react'

class EventHandler extends React.Component {

    componentDidMount() {
        window.addEventListener(this.props.event, this.props.children)
    }

    componentWillUnmount() {
        window.removeEventListener(this.props.event, this.props.children)
    }

    render() {
        return null
    }
}

export default EventHandler
