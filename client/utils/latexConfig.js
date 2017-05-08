// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { round as roundTo, elementsWithLocations, diagramBoundingBox } from 'utils'

// round a number to the tenths place to show in latex (package assumes grid of 50)
const round = n => (Math.round(n / 50 * 10) / 10).toFixed(2)

// a mapping of internal props to config options used by the latex library
const configMap = {
    stroke: 'color'
}

// a mapping of propagator kinds to their equivalent in the latex library
const kindMap = {
    em: 'electroweak'
}

// a mapping of keys to transformations when turning the values to their latex equivalent
const valueMap = {
    stroke: val => val.slice(2, val.length-1),
    labelDistance: val => round(parseFloat(val.slice(1, val.length-1))),
    labelLocation: val => round(parseFloat(val.slice(1, val.length-1))),
}

const transformCoords = ({x, y}, bb) => ({
    // shift all x's to be relative to left of bb
    x: round(x - bb.x1, 50),
    // we need to raise the coordinate by the height of the bounding box
    y: round(-y + bb.y2, 50),
})

export const propagatorConfig = ({
    info,
    id,
    x1:propX1,
    x2:propX2,
    y1:propY1,
    y2:propY2,
    anchor1,
    anchor2,
    kind,
    dispatch,
    ...propagator
}, bb) => {
    // the configuration string
    const config = Object.keys(propagator).map(
        prop => {
            // use the entry in the config map if it exists
            const key = configMap[prop] || prop
            // make sure to transform the value appropriately if we have to
            let value = `$${propagator[prop]}$`
            value = valueMap[prop] ? valueMap[prop](value) : value

            // join them in the appropriate manner
            return `${key}=${value}`
        }
    ).join(', ')

    const {x: x1, y: y1} = transformCoords({x: propX1, y: propY1}, bb)
    const {x: x2, y: y2} = transformCoords({x: propX2, y: propY2}, bb)

    // the position string
    const position = `{${x1}, ${y1}}{${x2}, ${y2}}`

    return `\\${kindMap[kind] || kind}[${config}]${position}`
}

const partonConfig = ({x, y, r = 25}, bb) => {
    // get the right coordinates in latex space
    const rel = transformCoords({x, y}, bb)

    // return the latex string
    return `\\parton[${round(rel.x, 50)},${round(rel.y, 50)}]{${round(r, 50)}}`
}

export const textConfig = ({x, y, value}, bb) => {
    // get the right coordinates in latex space
    const rel = transformCoords({x, y}, bb)

    // return the latex string
    return `\\text[${round(rel.x, 50)},${round(rel.y, 50)}]{${value}}`
}


export const shapeConfig = ({kind, ...shape}, bb) => ({
   parton: partonConfig,
})[kind](shape, bb)

// latexConfig returns the string for the diagram object
export const latexConfig = elements => {
    // make location more concrete
    const elementsWithLoc = elementsWithLocations(elements)

    // compute a tight bounding box
    const boundingBox = diagramBoundingBox(elements, 0)

    // the diagram as we know it
    let diagram = '\\begin{feynman}'

    // add the propagators
    for (const propagator of elementsWithLoc.propagators) {
        // add the diagram config
        diagram += propagatorConfig(propagator, boundingBox)
    }
    // add the shapes
    for (const shape of Object.values(elements.shapes)) {
        // add the diagram config
        diagram += shapeConfig(shape, boundingBox)
    }
    // add the texts
    for (const text of Object.values(elements.text)) {
        // add the diagram config
        diagram += textConfig(text, boundingBox)
    }

    // close off the diagram
    diagram += '\\end{feynman}'

    // return the diagram string
    return diagram
}
