// external imports
import React from 'react'
import SvgMatrix from 'svg-matrix'
// local imports
import range from 'utils/range'
import Align from '../Align'

const Gluon = ({ 
    x1, y1, x2, y2, amplitude:direction=1, 
    // pulled out to prevent cascade
    arrow, anchor1, anchor2, 
    ...unusedProps 
}) => {

    return (
        <g />
    )
}

export default Gluon