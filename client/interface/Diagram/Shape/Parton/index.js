// external imports
import React from 'react'
// local imports
import { brightBlue}  from 'colors'

const Parton = ({x, y, r, selected, color}) => (
    <circle
        cx={x}
        cy={y}
        r={r}
        fill={`url(#pattern-parton-lines${selected ? '-selected' : ''})`}
        stroke={selected ? brightBlue : color}
        style={{strokeWidth: 2}}
    />
)

export default Parton
