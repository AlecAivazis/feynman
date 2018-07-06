// external imports
import React from 'react'
import { connect } from 'react-redux'
import { AlertContainer } from 'quark-web'
// local imports
import './reset.css'
import styles from './styles'
import { Diagram, Sidebar, Title, Toolbar, PatternModal, ExportModal } from '..'

// App must be a class-based component because it will recieve a ref
const App = ({ info }) => (
    <main style={styles.container}>
        <Title style={styles.overlay} />
        <Toolbar style={styles.overlay} />
        <Sidebar />
        <Diagram />
        {info.showPatternModal && <PatternModal />}
        {info.showExportModal && <ExportModal />}
        <AlertContainer style={styles.alertContainer} />
    </main>
)

const selector = ({ diagram: { info } }) => ({ info })
export default connect(selector)(App)
