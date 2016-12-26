// external imports
import * as React from 'react'
// local imports
import './reset.css'
import styles from './styles'
import { Diagram, Sidebar } from '..'

const App = () => (
    <main style={styles.container}>
        <Sidebar />
        <Diagram />
    </main>
)

export default App
