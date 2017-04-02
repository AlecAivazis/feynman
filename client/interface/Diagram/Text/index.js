// external imports
import React from 'react'
// local imports
import { Text } from 'components'
import { Splittable } from 'components'

const TextElement = ({x, y, value, id}) => (
    <Splittable type="text" id={id}>
        <Text x={x} y={y}>
            {value}
        </Text>
    </Splittable>
)

export default TextElement
