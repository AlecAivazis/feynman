// external imports
import React from 'react'
// local imports
import Button from '../Button'
import styles from './styles'

const RedButton = ({ style, ...unusedProps }) => (
    <Button
        style={{...styles.container, ...style}}
        {...unusedProps}
    />
)

export default RedButton
