// external imports
import React from 'react'

const PropagatorSummary = ({propagators}) => (
    <div>
        {propagators.map(id => (
            <div key={id}>
                {id}
            </div>
        ))}
    </div>
)

export default PropagatorSummary
