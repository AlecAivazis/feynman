import { grey, darkGrey, mediumGrey } from 'colors'

export default {
    container: {
    },
    slider: {
        borderRadius: '100%',
        position: 'absolute',
        width: 20,
        height: 20,
        cursor: 'pointer',
        backgroundColor: 'white',
        border: `1px solid ${darkGrey}`,
        marginTop: -8,
        marginLeft: -8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerSlider: {
        backgroundColor: '#646464',
        borderRadius: '100%',
        width: 10,
        height:10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sizeIndicator: {
        fontSize: 12,
        color: mediumGrey
    },
    sliderContainer: {
        padding: '0 5px',
    }
}