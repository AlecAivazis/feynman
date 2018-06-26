// external imports
import React from 'react'
// local imports
import styles from './styles'

class Input extends React.Component {
    state = {
        edited: false,
    }

    componentWillUnmount() {
        if (this.state.edited) {
            this.props.onFinish(this.props.value)
            this.setState({
                edited: false,
            })
        }
    }

    render() {
        const { style, onKeyDown, onChange, ...unusedProps } = this.props

        return (
            <input
                style={{ ...styles.input, ...style }}
                onKeyDown={evt => {
                    evt.stopPropagation()
                }}
                ref={e => (this._input = e)}
                onBlur={evt => {
                    if (this.state.edited) {
                        this.props.onFinish(this.props.value)
                        this.setState({
                            edited: false,
                        })
                    }
                }}
                onChange={evt => {
                    // if there is a change callback
                    if (this.props.onChange) {
                        this.props.onChange(evt)
                    }
                    this.setState({ edited: true })
                }}
                {...unusedProps}
            />
        )
    }
}

Input.defaultProps = {
    onKeyDown: () => {},
}

export default Input
