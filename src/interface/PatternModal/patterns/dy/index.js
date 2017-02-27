// local imports
import image from './image.png'

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
                x: 100,
                y: 200
            }
        ],
        propagators: [
            {
                id: 1,
                kind: 'fermion',
                anchor1: 2,
                anchor2: 1,
            }
        ]
    }
}
