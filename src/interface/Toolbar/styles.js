// local imports
import { image } from './ItemPalette/styles'

export const toolbarWidth = 220

export default {
    container: {
        width: toolbarWidth,
        position: 'absolute',
        right: 0,
        height: '100%',
        display: 'flex',
        backgroundColor: 'rgba(50,50,50,0.65)',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 5,
    },
    shadow: {
        ...image,
        position: 'fixed',
    }
}