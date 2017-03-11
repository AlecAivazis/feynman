// external imports
import React from 'react'
// local imports
import styles from './styles'

const Select = ({style, ...unusedProps}) => (
    <select style={{...styles.select, ...style}} {...unusedProps}/>
)

export default Select
export Option from './option'
