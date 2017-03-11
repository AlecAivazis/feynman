// external imports
import React from 'react'

// local imports
import Fermion from '../Fermion'

const Dashed = ({...unusedProps}) => (
    <Fermion {...unusedProps} strokeDasharray={10}/>
)

export default Dashed