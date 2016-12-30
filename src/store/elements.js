// the initial state is an empty list of elements
export const initialState = [
    {
        type: 'fermion',
        x1: 0,
        y1: 50,
        x2: 50,
        y2: 100,
    },
    {
        type: 'em',
        x1: 100,
        y1: 150,
        x2: 150,
        y2: 200,
    }
]

export default (state = initialState, {type, payload}) => {
    // its an action we don't recognize
    return state
}
