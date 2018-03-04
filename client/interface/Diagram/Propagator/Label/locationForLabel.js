// local imports
import { defaultProps } from '..'

export default function locationForLabel({
    x1,
    x2,
    y1,
    y2,
    distance: r = defaultProps.labelDistance,
    location: s = defaultProps.labelLocation,
    label,
}) {
    // the midpoint
    const midx = x1 + s * (x2 - x1)
    const midy = y1 + s * (y2 - y1)

    // the slope of the perpendicular line
    // m` = -1 / m
    const m = -(x1 - x2) / (y1 - y2)

    // the points that are perpedicular to the line a distance r away satisfy
    // the following system of equations:
    //
    //     y = mx
    //     x^2 + y^2 = r
    //
    const x = Math.sqrt(r * r / (1 + m * m))
    const y = m * x

    // the multiplier for distance away from line
    const rSign = r > 0 ? 1 : -1
    const mSign = m > 0 ? 1 : -1

    // add these values to the mid points to displace the label
    // WARNING: these signs take into account the possible minus sign from midx/y calculation
    const labelx = midx - mSign * rSign * x
    let labely = midy - mSign * rSign * y

    // check against horizontal lines
    if (isNaN(labely)) {
        labely = midy - r
    }

    // return the label coordinates
    return {
        x: labelx,
        y: labely,
    }
}
