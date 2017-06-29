// external imports
import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

const Text = ({math, children, x, y, color, ...unused}) => {
    // the text for the label
    const string = children.trim()

    // if there is an empty string to render
    if (!string) {
        // dont render anything
        return null
    }

    // the url with the rendered image
    const imgUrl = `/latex?${queryString.stringify({
       string,
       mathMode: JSON.stringify(math),
       color,
    })}`

    return (
        <image
            x={x}
            y={y}
            href={imgUrl}
            xlinkHref={imgUrl}
            {...unused}
        />
    )
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
