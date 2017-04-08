// external imports
import React from 'react'
import PropTypes from 'prop-types'
// local imports
import styles from './styles'
import Header from './Header'

const preventBubble = (event) => event && event.stopPropagation()

const Overlay = ({addon, title, children, hide, onClick, style, ...unusedProps}) => (
    <aside style={styles.container} {...unusedProps} onClick={hide}>
        <section  style={styles.contentWrapper} onClick={preventBubble}>
            <Header addon={addon} hide={hide}>
                {title}
            </Header>
            <div style={{...styles.content, ...style}}>
                {children}
            </div>
        </section>
    </aside>
)

Overlay.PropTypes = {
    hide: PropTypes.func.isRequired,
    addon: PropTypes.element,
    style: PropTypes.object,
}

export default Overlay
