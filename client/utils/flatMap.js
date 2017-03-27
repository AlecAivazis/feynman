
// 💪
export default function(arr, lambda) {
    return Array.prototype.concat.apply([], arr.map(lambda));
}
