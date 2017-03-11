// local imports
import image from './image.png'
import { blue } from 'colors'

export default {
    name: "Drell-Yan",
    image,
    elements: {
        type: "pattern",
        anchors: [
            {
                id: 1,
                x: 50,
                y: 100,
            },
            {
                id: 2,
                x: 150,
                y: 200
            },
            {
                id: 3,
                x: 50,
                y: 300
            },
            {
                id: 4,
                x: 400,
                y: 100,
            },
            {
                id: 5,
                x: 300,
                y: 200,
            },
            {
                id: 6,
                x: 400,
                y: 300
            }
        ],
        propagators: [
            {
                id: 1,
                kind: 'fermion',
                anchor1: 2,
                anchor2: 1,
            },
            {
                id: 2,
                kind: 'fermion',
                anchor1: 3,
                anchor2: 2,
            },
            {
                id: 3,
                kind: 'em',
                stroke: blue,
                anchor1: 2,
                anchor2: 5,
            },
            {
                id: 4,
                kind: 'fermion',
                anchor1: 4,
                anchor2: 5,
            },
            {
                id: 5,
                kind: 'fermion',
                anchor1: 5,
                anchor2: 6,
            }
        ]
    }
}
