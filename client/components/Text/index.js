// external imports
import React from 'react'

const Text = ({math, children, x, y}) => (
    <image
        x={x}
        y={y}
        href={`/latex?string=${children}&mathMode=${JSON.stringify(math)}`}
        xlinkHref={`/latex?string=${children}&mathMode=${JSON.stringify(math)}`}
    />
)

Text.defaultProps = {
    math: false,
}

Text.propTypes = {
    math: React.PropTypes.bool,
    children: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
}

export default Text
