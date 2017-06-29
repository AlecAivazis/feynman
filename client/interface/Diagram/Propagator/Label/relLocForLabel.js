export default function relLocForLabel(location, propagator) {
    // compute the distance between the label and the first anchor
    const dx = location.x - propagator.x1
    const dy = location.y - propagator.y1
    const r = Math.sqrt(dx*dx + dy*dy)

    // save a reference to the distances between the anchors
    const anchorDx = propagator.x2 - propagator.x1
    const anchorDy = propagator.y1 - propagator.y2
    const m = anchorDy / anchorDx

    // compute the angle formed by the lengths
    let θ = Math.atan2(dy, dx) + Math.atan2(anchorDy, anchorDx)
    // if a flip is necessary
    if (anchorDx < 0 || anchorDx === 0 && anchorDy < 0) {
        // invert the angle
        θ *= -1
    }

    // return the resulting location
    return {
        labelDistance: -r * Math.sin(θ),
        labelLocation: r * Math.cos(θ) / Math.sqrt(anchorDx*anchorDx + anchorDy*anchorDy)
    }
}