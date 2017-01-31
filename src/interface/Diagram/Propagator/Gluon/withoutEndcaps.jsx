// external imports
import React from 'react'
// local imports
import Align from '../Align'


const GluonWithoutEndcaps = ({
    x1, y1, x2, y2, direction,
    // pulled out to prevent cascade
    arrow, anchor1, anchor2,
    ...unusedProps
}) => {
    // compute the length of the line
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx*dx + dy*dy)

    // the width of the pattern
    const scale = 10
    // the height of the pattern
    const amplitude = dx < 0 ? scale : - scale

    // find the closest number of full loops
    const nLoops = Math.round(length / scale / 2)

    // the running counters
    let cx = x1
    let cy = y1
    // the top and bottom limts for the pattern
    const ymin = cy
    const ymax = cy + 2 * direction * amplitude

    // the step size
    const delta = scale

    // start the path off
    let pathString = `M ${cx} ${cy} `

    // the first loop has to be drawn separately since it starts with a C
    pathString += `C ${cx+2*scale} ${ymin} ${cx+2*scale} ${ymax} ${cx+delta} ${ymax} `
    // update the running total
    cx += delta
    // the second half
    pathString += `S ${cx-delta} ${ymin} ${cx+delta} ${ymin} `
    // update the running total
    cx += delta

    // draw the rest of the loops
    for(let cycle = 1; cycle < nLoops ; cycle++) {
        // add the first half of the loop
        pathString += `S ${cx+2*scale} ${ymax} ${cx+delta} ${ymax} `
        // update the running counter
        cx += delta
        // second half of the loop
        pathString += `S ${cx-delta} ${ymin} ${cx+delta} ${ymin} `
        // update the running counter
        cx += delta
    }

    return (
        <Align
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
            length={2 * scale * nLoops}
            degrade={nLoops === 0}
            element={{ x1, x2, y1, y2, direction, arrow, anchor1, anchor2, ...unusedProps }}
        >
            <path
                {...unusedProps}
                fill="none"
                d={pathString}
            />
        </Align>
    )
}

export default GluonWithoutEndcaps