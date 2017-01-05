// external imports
import React from 'react'
// local imports
import styles from './styles'

const ToolbarFooter = ({ style, ...unusedProps }) => (
    <div style={{...styles.container, ...style}} {...unusedProps}>
        <div style={styles.line}>
            by
            <a href="http://alec.aivazis.com" target="_blank" style={styles.link}>
                Alec Aivazis
            </a>
        </div>
        <div style={styles.line}>
            Found a bug? <br/>
            File an issue on
            <a href="https://github.com/AlecAivazis/feynman/issues" target="_blank" style={styles.link}>
                GitHub
            </a>
        </div>
    </div>
)

export default ToolbarFooter
