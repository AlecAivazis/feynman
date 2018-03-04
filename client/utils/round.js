// if we are rounding to zero, don't round at all. Otherwise, round to the nearest bucket
const round = (n, to) => (to === 0 ? n : Math.round(n / to) * to)

export default round
