// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Label, Input } from 'components'
import styles from './styles'
import { setDiagramTitle } from 'actions/info'

const TitleControl = ({style, info, dispatch, ...unusedProps}) => (
    <div style={{...styles.container, ...style}}>
        <Label style={styles.label}>title</Label>
        <Input
            style={styles.input}
            value={info.title}
            onChange={({target}) => dispatch(setDiagramTitle(target.value))}
        />
    </div>
)

const selector = ({diagram: {info}}) => ({info})
// export the connected component
export default connect(selector)(TitleControl)
