// external imports
import React from 'react'

const Parton = ({x, y, r}) => (
    <circle
        x={x}
        y={y}
        r={r}
    />
)

Parton.defaultProps = {
    r: 20,
}

export default Parton
