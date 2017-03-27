// local imports
import { anotherGrey, brightBlue } from 'colors'

const container = {
    display: 'flex',
    flexDirection: 'column',
    width: '29.5%',
    boxShadow: '0px 2px 5px 0px rgba(208,208,208,0.75)',
    backgroundColor: 'white',
    borderRadius: 6,
    margin: '1.5%',
    cursor: 'pointer',
}

export default {
    container,
    hoverContainer: {
        ...container,
        border: `2px solid ${brightBlue}`,
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: `1px solid ${anotherGrey}`,
        padding: 10,
    },
    content: {
        display: 'flex',
    },
    image: {
        width: '100%',
    },
}
