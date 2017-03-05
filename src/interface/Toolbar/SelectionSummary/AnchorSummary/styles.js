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
    colorPicker: {
        marginLeft: 'auto',
        marginRight: 10,
    }
}
