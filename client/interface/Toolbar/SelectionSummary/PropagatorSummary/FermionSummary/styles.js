// local imports
import { red } from 'colors'

const button = {
    display: 'flex',
    flexGrow: 1,
    width: 10,
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
}

export default {
    container: {
       display: 'flex',
       flexDirection: 'row', 
    },
    hideButton: {
        ...button,
        width: 45,
        marginRight: 10,
        color: red,
    },
    flipButton: {
        ...button,
    },
    showButton: {
        ...button, 
    }
}