// external imports
import React from 'react'
import SvgMatrix from 'svg-matrix'
// local imports
import range from 'utils/range'
import Align from '../Align'

const ElectroWeak = ({
    x1, y1, x2, y2, direction,
    // pulled out to prevent cascade
    arrow, anchor1, anchor2,
    ...unusedProps
}) => {
    // the width of the pattern
    const scale = 20
    // the height of the pattern
    const amplitude = 3 * scale / 2
    // compute the length of the line
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx*dx + dy*dy)

    // find the closest whole number of full periods
    const nPeriods = Math.round(length/scale)

    // running totals to track the current location
    let cx = x1
    const cy = y1

    // the upper and lower y coorindates for the anchors
    const ymin = cy - direction * amplitude
    const ymax = cy + direction * amplitude

    // start the path at the current (x, y) location
    let pathString = `M ${cx} ${cy} `
    pathString += `C ${cx+scale/2} ${ymin} ${cx+scale/2} ${ymax} ${cx+scale} ${cy} `

    // for each period we have to render (correct for zero indexing)
    for (const _ of range(nPeriods-1)) {
        // increment the running counter
        cx += scale
        // add the period
        pathString += `S ${cx+scale/2} ${ymax} ${cx+scale} ${cy} `
    }

    // render the actual path
    return (
        <Align
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            length={nPeriods * scale}
            degrade={nPeriods === 1}
            element={{ x1, x2, y1, y2, direction, arrow, anchor1, anchor2, ...unusedProps }}
        >
            <path
                {...unusedProps}
                fill="none"
                d={pathString}/>
        </Align>
    )
}

ElectroWeak.defaultProps = {
    direction: 1,
}

export default ElectroWeak