// external imports
import React from 'react'
// local imports
import styles from './styles'

const PaletteItem = ({style, image, ...unusedProps}) => (
    <div style={{...styles.paletteItem, ...style}} {...unusedProps}>
        <img src={image}/>
    </div>
)

PaletteItem.propTypes = {
    style: React.PropTypes.string,
    image: React.PropTypes.string,
}

export default PaletteItem
