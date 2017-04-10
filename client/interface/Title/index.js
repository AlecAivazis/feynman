// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'

const DiagramTitle = ({style, info}) => (
    <h1 style={{...styles.container, ...style}}>
        {info.title}
    </h1>
)

const selector = ({diagram: {info}}) => ({info})
export default connect(selector)(DiagramTitle)
