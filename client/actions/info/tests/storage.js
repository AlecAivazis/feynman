export default class Storage {
    value = {}

    getItem(field) {
        return this.value[field]
    }

    setItem(field, val) {
        this.value[field] = val
    }

    clear() {
        this.value = {}
    }
}