// external imports
import React from 'react'
// local imports
import './reset.css'
import styles from './styles'
import { Diagram, Sidebar, Title } from '..'

const App = () => (
    <main style={styles.container}>
        <Title style={styles.overlay}/>
        <Sidebar />
        <Diagram />
    </main>
)

export default App
