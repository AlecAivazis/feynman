// external imports
import React from 'react'
import liftC from 'react-liftc'

const state = {
    initialValue: {
        origin: null,
    },
    handlers: {

    }
}

const ElementDrag = ({children}) => {
    // return the only child
    const child =  React.Children.only(children)

    return (
        <g

        >
            {child}
        </g>        
    )
}

export default ElementDrag
