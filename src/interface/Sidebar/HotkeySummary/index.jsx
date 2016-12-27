// external imports
import React from 'react'
// local imports
import styles from './styles'
import { Collapsible } from 'components'
import Hotkey from './Hotkey'

const HotkeySummary = ({style, ...unusedProps}) => (
    <Collapsible title="Hotkeys">
        <div style={{...styles.container, ...style}}>
            <Hotkey
                trigger="Left click"
                action="Select element"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="Drag on canvas"
                action="Select multiple elements"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="Drag on element"
                action="Move an element"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="alt + click"
                action="New anchor"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="alt + drag"
                action="New propagator"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="alt + drag from an existing element"
                action="New branch"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="bkspace or delete"
                action="Delete selected element"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="Drag from pallet and drop on anchor or alt+drag from existing constraint."
                action="Constrain element to shape."
                style={styles.hotkey}
            />
            <Hotkey
                trigger="ctrl + z"
                action="Undo"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="ctrl + shift + z"
                action="Redo"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="space + drag"
                action="pan"
                style={styles.hotkey}
            />
            <Hotkey
                trigger="scroll wheel"
                action="Zoom"
                style={styles.hotkey}
            />
        </div>
    </Collapsible>
)

export default HotkeySummary
