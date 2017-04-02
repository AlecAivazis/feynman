// external imports
import React from 'react'
// local imports
import { Text, Splittable } from 'components'
import styles from './styles'

const TextElement = ({x, y, value, id, selected}) => {

    // the style to apply to the text (disabled  because we render slowly)
    // const style = selected ? styles.selected : styles.notSelected
    const style = styles.notSelected

    return (
        <Splittable type="text" id={id}>
            <Text x={x} y={y} {...style}>
                {value}
            </Text>
        </Splittable>
    )
}

export default TextElement
