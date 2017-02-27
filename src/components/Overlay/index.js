// external imports
import React from 'react'
// local imports
import styles from './styles'
import Header from './Header'

const preventBubble = (event) => event && event.stopPropagation()

const Overlay = ({style, addon, title, children, hide, onClick, contentStyle, ...unusedProps}) => (
    <aside style={styles.container} {...unusedProps} onClick={hide}>
        <section  style={style} onClick={preventBubble}>
            <Header addon={addon} hide={hide}>
                {title}
            </Header>
            <div style={{...styles.content, ...contentStyle}}>
                {children}
            </div>
        </section>
    </aside>
)

Overlay.PropTypes = {
    hide: React.PropTypes.func.isRequired,
    addon: React.PropTypes.element,
    contentStyle: React.PropTypes.object,
}

export default Overlay
