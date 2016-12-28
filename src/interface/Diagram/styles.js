// local imports
import { grey } from 'colors'

const container = {
    display: 'flex',
    flexGrow: 1,
}

export default {
    containerWithGrid: {
        ...container,
        backgroundColor: "rgb(245, 245, 245)",
    },
    containerWithoutGrid: {
        ...container,
    }
}
