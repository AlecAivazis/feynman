// external imports
import React from 'react'

export default ({checked, onClick, readOnly, ...unused}) => (
    <input 
        type="checkbox" 
        checked={checked} 
        onClick={onClick} 
        readOnly={readOnly || Boolean(!onClick)} 
        {...unused} 
    />
)
