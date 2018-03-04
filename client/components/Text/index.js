// external imports
import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

class Text extends React.Component {
    componentDidMount() {
        // create a browser image we can use to find the height and width
        var img = new Image()
        img.src = this._imgUrl
        img.onload = () => {
            this.setState({
                width: img.height,
                height: img.height,
            })
        }
    }

    state = {
        width: 0,
        height: 0,
    }

    get _imgUrl() {
        return `/latex?${queryString.stringify({
            string: this.props.children.trim(),
            mathMode: JSON.stringify(this.props.math),
            color: this.props.color,
        })}`
    }

    render() {
        const { math, children, x, y, color, ...unused } = this.props

        // the text for the label
        const string = children.trim()

        // if there is an empty string to render
        if (!string) {
            // dont render anything
            return null
        }

        // return the image primitive that will be embedded an an svg
        return (
            <image
                x={x}
                y={y}
                width={this.state.width}
                height={this.state.height}
                href={this._imgUrl}
                xlinkHref={this._imgUrl}
                {...unused}
            />
        )
    }
}

Text.defaultProps = {
    math: false,
    color: 'black',
}

Text.propTypes = {
    math: PropTypes.bool,
    children: PropTypes.string,
    color: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
}

export default Text
