// external imports
import React from 'react'
// local imports
import styles from './styles'

const Label = ({style, children, ...unusedProps}) => (
  <label style={{...styles.label, ...style}}>
    {children}
  </label>
)

export default Label
