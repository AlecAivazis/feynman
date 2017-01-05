// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'
import SelectionSummary from './SelectionSummary'
import ItemPalette from './ItemPalette'
import Footer from './Footer'

const Toolbar = ({style, selection, ...unusedProps}) => (
    <div style={{...styles.container, ...style}}>
        {selection.length > 0
            ? <SelectionSummary selection={selection}/>
            : <ItemPalette />
        }
        <Footer />
    </div>
)

const selector = ({elements}) => ({selection: elements.selection})
export default connect(selector)(Toolbar)
