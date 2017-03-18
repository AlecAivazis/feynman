// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import './reset.css'
import styles from './styles'
import { Diagram, Sidebar, Title, Toolbar, PatternModal, ExportModal } from '..'
import DevTools from 'components/DevTools'

// App must be a class-based component because it will recieve a ref
const App = ({info}) => (
    <main style={styles.container}>
        <Title style={styles.overlay}/>
        <Toolbar style={styles.overlay}/>
        <Sidebar />
        <Diagram />
        {info.showPatternModal && <PatternModal />}
        {info.showExportModal && <ExportModal />}
    </main>
)

const selector = ({diagram: {info}}) => ({info})
export default connect(selector)(App)
