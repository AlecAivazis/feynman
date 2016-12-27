import { blue } from 'colors'

export default {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12,
        fontWeight: 'bold',
    },
    toggle: {
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 'bold',
        color: blue,
        textTransform: 'capitalize',
    }
}