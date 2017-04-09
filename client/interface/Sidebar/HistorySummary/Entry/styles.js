import { lightBlue } from 'colors'

const container = {
   fontSize: 12,
   display: 'flex',
   flexDirection: 'row',
   cursor: 'pointer',
}

export default {
    container,
    active: {
        ...container,
        color: lightBlue,
    },
    index: {
        width: '12%',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
        paddingRight: 5,
    },
    message: {
        width: '87%',
        display: 'flex',
    },
}
