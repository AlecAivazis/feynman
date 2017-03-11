// local imports
import { yagLGrey } from 'colors'

// dimentions
export const sidebarWidth = 250
export const elementSpacing = 10

export default {
    container: {
        display: 'flex',
        width: sidebarWidth,
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: '0 10px',
    },
    sidebarContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    element: {
        padding: elementSpacing,
        paddingBottom: 0,
    },
    elementWithBorder: {
        padding: elementSpacing,
        borderBottom: `1px solid ${yagLGrey}`,
    }
}
