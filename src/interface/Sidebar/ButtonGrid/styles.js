const buttonRow = {
    display: 'flex',
    flexDirection: 'row',
    margin: '0px 10px',
    justifyContent: 'space-between',
}

export default {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    leftButton: {
        marginRight: 10,
    },
    buttonRow,
    bottomRow: {
        ...buttonRow,
        marginTop: 10,
        justifyContent: "center",
    }
}
