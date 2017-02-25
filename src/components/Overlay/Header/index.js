// external imports
import React from 'react'

const OverlayHeader = ({children, addon, ...unusedProps}) => (
    <div {...unusedProps}>
        {children}
        {addon}
    </div>
)

export default OverlayHeader
