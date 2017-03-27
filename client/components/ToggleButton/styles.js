import { lightBlue, red } from 'colors'

const button = {
    outline: 'none',
}

export default {
    active: {
        ...button,
        color: lightBlue,
    },
    inactive: {
        ...button,
        color: red,
    }
}
