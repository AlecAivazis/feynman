// external imports
import React from 'react'
// local imports
import styles from './styles'

const Select = ({...unusedProps}) => (
    <select style={styles.select} {...unusedProps}/>
)

export default Select
export Option from './option'
