// external imports
import React from 'react'
// local imports
import styles from './styles'
import range from 'utils/range'

const ElectroWeak = ({ x1, y1, x2, y2, ...unusedProps }) => {
    // the width of the pattern
    const scale = 20
    // the height of the pattern
    const amplitude = 3 * scale / 2
    // compute the length of the line
    const dx = x1 - x2
    const dy = y1 - y2
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
    let angle = Math.atan(dy/dx) * 180/Math.PI
    if (dx > 0) {
        angle += 180
    }

    // scale the length to fit the grid
    const lengthScale = Math.abs(dx / (nPeriods * scale))

    // render the actual path
    return (
        <path
            {...styles.container}
            {...unusedProps}
            fill="none"
            transform={`scale(${lengthScale}) rotate(${angle}, ${x1}, ${y1})`}
            d={pathString}
        />
    )
}

export default ElectroWeak
