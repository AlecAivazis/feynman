import * as React from 'react'

interface HelloProps {
    compiler: string
}

const Hello = (props: HelloProps) => (
    <h1>
        hello from {props.compiler}!
    </h1>
)


export default Hello

