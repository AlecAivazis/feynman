// local imports
import { yagLGrey } from 'colors'

export default {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(69, 69, 69, 0.8)',
        zIndex: 5,
    },
    header: {
        display: 'flex',
    },
    content: {
        backgroundColor: yagLGrey,
        borderRadius: '0 0 6px 6px',
        padding: '1.5%',
    },
    contentWrapper: {
        width: '70%',
    }
}