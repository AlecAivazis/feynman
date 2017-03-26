// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { round as roundTo } from 'utils'

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
    stroke: val => val.slice(1, val.length)
}

const LatexPropagator = ({
    info,
    id,
    x1,
    x2,
    y1,
    y2,
    anchor1,
    anchor2,
    kind,
    dispatch,
    ...propagator
}) => {
    // the configuration string
    const config = Object.keys(propagator).map(
        prop => {
            // use the entry in the config map if it exists
            const key = configMap[prop] || prop
            // make sure to transform the value appropriately if we have to
            let value = propagator[prop]
            value = valueMap[prop] ? valueMap[prop](value) : value

            // join them in the appropriate manner
            return `${key}: ${value}`
        }
    ).join(', ')

    // the position string
    const position = `{${round(x1)}, ${round(y1)}}` +
                     `{${round(x2)}, ${round(y2)}}`

    return (
        <div>
            &nbsp;&nbsp;&nbsp;&nbsp;\{kindMap[kind] || kind}{`[${config}]`}{position}
        </div>
    )
}

const selector = ({diagram: {info}}) => ({info})
export default connect(selector)(LatexPropagator)
