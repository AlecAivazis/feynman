// external imports
import React from 'react'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
// local imports
import './reset.css'
import styles from './styles'
import { Diagram, Sidebar, Title, Toolbar } from '..'

// App must be a class-based component because it will recieve a ref
class App extends React.Component {
    render() {
        return (
            <main style={styles.container}>
                <Title style={styles.overlay}/>
                <Toolbar style={styles.overlay}/>
                <Sidebar />
                <Diagram />
            </main>
        )
    }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(App)
