// local imports
import { itsGrey } from 'colors'

export const image = {
    userDrag: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none',
}

export default {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 25,
    },
    header: {
        textTransform: 'uppercase',
        color: 'white',
        fontSize: 12,
        marginBottom: 10,
    },
    subHeader: {
        color: itsGrey,
        fontSize: 12,
    },
    palette: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    paletteItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        height: 75,
        width: 75,
        background: 'rgba(137,137,137,0.8) linear-gradient(180deg, rgba(153,153,153,0.8), rgba(137,137,137,0.8)) repeat-x',
        boxShadow: 'inset 1px 1px 5px 0px rgba(204,204,204,0.2), 0px 2px 1px 0px rgba(50,50,50,0.3)',
        marginBottom: 25,
    },
    image,
    patternButtonContainer: {
        width: '100%',
    },
    patternButton: {
        width: '100%',
    }
}
