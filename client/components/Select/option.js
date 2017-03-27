// external imports
import React from 'react'
// local imports
import styles from './styles'

const Option = ({...unusedProps}) => (
    <option style={styles.option} {...unusedProps} />
)

export default Option
