// external imports
import React from 'react'
// local imports
import styles from './styles'
import Button from '../Button'

const ToggleButton = ({ style, active, activeText, inactiveText, ...unusedProps }) => {
    // get the appropriate style
    const buttonStyle = active ? styles.inactive : styles.active

    return (
        <Button style={{...buttonStyle, ...style}} {...unusedProps}>
            { active ? activeText : inactiveText }
        </Button>
    )
}

export default ToggleButton
