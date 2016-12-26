// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import styles from './styles'

const DiagramTitle = ({style, info}) => (
    <div style={{...styles.container, ...style}}>
        {info.title}
    </div>
)

const selector = ({info}) => ({info})
export default connect(selector)(DiagramTitle)
