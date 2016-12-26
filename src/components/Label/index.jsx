// external imports
import React from 'react'
// local imports
import styles from './styles'

const Label = ({children, ...unusedProps}) => (
  <label style={styles.label}>
    {children}
  </label>
)

export default Label
