export const sidebarWidth = 250

// to be imported in children for consistency
export const element = {
    marginBottom: 10,
}

export default {
    container: {
        display: 'flex',
        width: sidebarWidth,
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: '10px 20px',
    },
    sidebarContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 10,
    },
    element,
}
