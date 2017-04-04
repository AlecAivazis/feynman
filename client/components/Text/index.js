// external imports
import React from 'react'
import queryString from 'query-string'

const Text = ({math, children, x, y, color, ...unused}) => {
    // the url with the rendered image
    const imgUrl = `/latex?${queryString.stringify({
       string: children,
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
    math: React.PropTypes.bool,
    children: React.PropTypes.string,
    color: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
}

export default Text
