import { lightBlue } from 'colors'

const historyEntry = {
   fontSize: 12,
   display: 'flex',
   flexDirection: 'row',
   cursor: 'pointer',
}

export default {
    container: {
        marginTop: 10,
    },
    historyEntry,
    historyIndex: {
        width: '12%',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
        paddingRight: 5,
    },
    historyMessage: {
        width: '87%',
        display: 'flex',
    },
    selectedEntry: {
        ...historyEntry,
        color: lightBlue,
    }
}
