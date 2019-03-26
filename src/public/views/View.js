export default class View {
    constructor (data) {
        this.parent = data.parent;
        this.callbacks = data.callbacks;
    }

    render () {
        return null;
    }
}
