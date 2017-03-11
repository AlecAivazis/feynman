// external imports
import React from 'react'
import SvgMatrix from 'svg-matrix'
// local imports
import range from 'utils/range'
import With from './withEndCaps'
import Without from './withoutEndcaps'

// which gluon we show depends on wether there are end caps or not
const Gluon = ({endcaps, ...unusedProps}) => endcaps ? <With {...unusedProps} /> : <Without {...unusedProps} />

Gluon.defaultProps = {
    endcaps: true,
    direction: 1,
}

export default Gluon
