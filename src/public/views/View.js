export default class View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = '',
        parentView = null
    }) {
        this.parent = parent;
        this.parentView = parentView;
        this.callbacks = callbacks;
        this.elem = null;
        this.callbacksForView = this.callbacks[nameOfView];
        View.instance = this;
    }

    render () {
        return null;
    }

    onDestroy () {
        if (!this.callbacksForView) {
            return;
        }
        Object.entries(this.eventlistnersForView).forEach(([event, callback]) => {
            this.elem.removeEventListener(event, callback);
        });
    }

    setEvents () {
        if (!this.callbacksForView) {
            return;
        }
        this.eventlistnersForView = {};
        Object.entries(this.callbacksForView).forEach(([event, callback]) => {
            this.eventlistnersForView[event] = callback(this);
            this.elem.addEventListener(event, this.eventlistnersForView[event]);
        });
    }
}
