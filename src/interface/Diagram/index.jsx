// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'

const Diagram = ({style, diagram}) => (
    <section style={{...styles.container, ...style}}>
        <h1 style={styles.diagramTitle}>
            {diagram.title}
        </h1>
    </section>
)

const selector = ({diagram}) => ({diagram})
export default connect(selector)(Diagram)
