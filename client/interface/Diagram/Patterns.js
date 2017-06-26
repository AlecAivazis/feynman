// external imports
import React from 'react'
// local imports
import { brightBlue } from 'colors'

const DiagramPatterns = () => (
    <g>
        {/* patterns used in the application */}
        <pattern
            x="0" y="0" width="10" height="10" viewBox="0 0 10 10"
            patternUnits="userSpaceOnUse" id="pattern-parton-lines"
        >
            <path
                d="M10-5-10,15M15,0,0,15M0-5-20,15"
                fill="none"
                stroke="#b8b8b8"
                style={{strokeWidth: 2}}
            />
        </pattern>
        <pattern
            x="0" y="0" width="10" height="10" viewBox="0 0 10 10"
            patternUnits="userSpaceOnUse" id="pattern-parton-lines-selected"
        >
            <path
                d="M10-5-10,15M15,0,0,15M0-5-20,15"
                fill="none"
                stroke={brightBlue}
                style={{strokeWidth: 2}}
            />
        </pattern>
    </g>
)

export default DiagramPatterns
