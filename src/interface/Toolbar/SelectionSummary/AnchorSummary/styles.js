import { lightBlue } from 'colors'

const button = {
    display: 'flex',
    alignSelf: 'center',
    textTransform: 'capitalize',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
}

export default {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        padding: '0 15px',
        minHeight: 30,
        marginBottom: 10,
    },
    multiRow: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        marginBottom: 10,
    },
    value: {
        color: 'white',
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        fontSize: 14,
    },
    sliderRow: {
        padding: '0 30px',
        minHeight: 'none',
        marginBottom: 0,
    },
    buttonRow: {
        marginTop: 5,
        justifyContent: 'center',
        padding: '0 30px',
    },
    fixButton: {
        ...button,
    },
    deleteButton: {
        ...button,
    },
    alignButton: {
        ...button,
        color: lightBlue,
        width: '100%',
    },
}
