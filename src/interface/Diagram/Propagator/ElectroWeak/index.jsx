// external imports
import React from 'react'
import SvgMatrix from 'svg-matrix'
// local imports
import styles from './styles'
import range from 'utils/range'

const ElectroWeak = ({ x1, y1, x2, y2, ...unusedProps }) => {
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
    const ymin = cy - amplitude
    const ymax = cy + amplitude

    // start the path at the current (x, y) location
    let pathString = `M ${cx} ${cy} `
    pathString += `C ${cx+scale/2} ${ymin} ${cx+scale/2} ${ymax} ${cx+scale} ${cy} `

    // for each period we have to render
    for (const _ of range(nPeriods)) {
        // increment the running counter
        cx += scale
        // add the period
        pathString += `S ${cx+scale/2} ${ymax} ${cx+scale} ${cy} `
    }

    // compute the angle we need to rotate the propagator to line up correctly
    const angle = Math.atan2(dy, dx) * 180/Math.PI

    // the transform matrix to line the propagator up to the anchors
    const scaleFactor = length / (nPeriods * scale)
    const transform = SvgMatrix()
                        .rotate(angle, x1, y1)
                        .scale(scaleFactor, scaleFactor, x1, y1)

    // render the actual path
    return (
        <path
            {...styles.container}
            {...unusedProps}
            fill="none"
            transform={transform.transformString}
            d={pathString}/>
    )
}

export default ElectroWeak