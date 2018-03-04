// an object to hold memoized values
const memo = {}

const range = n => {
    // if there is an entry in the memoization store
    if (memo[n]) {
        // return it
        return memo[n]
    }

    // the usual recursive implementation
    const value = n > 1 ? range(n - 1).concat([n - 1]) : [0]
    // save the memoized value
    memo[n] = value

    // return it to the user
    return value
}

export default range
