// external imports
import React from 'react'
import PropTypes from 'prop-types'
// local imports
import styles from './styles'

const PaletteItem = ({ style, image, element, onMouseDown, config, ...unusedProps }) => (
    <div
        style={{ ...styles.paletteItem, ...style }}
        onMouseDown={event => onMouseDown({ image, event, config })}
        {...unusedProps}
    >
        {/* the static image */}
        <img style={styles.image} src={image} />
    </div>
)

PaletteItem.propTypes = {
    style: PropTypes.string,
    image: PropTypes.string,
    config: PropTypes.object.isRequired,
}

export default PaletteItem
