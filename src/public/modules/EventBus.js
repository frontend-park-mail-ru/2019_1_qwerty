class EventBus {
    constructor () {
        this.listeners = {};
    }

    on (event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        if (!this.listeners[event].some(elem => elem === callback)) {
            this.listeners[event].push(callback);
        }
    }

    emit (event, data) {
        this.listeners[event].forEach(callback => {
            callback(data);
        });
    }

    off (event, callback) {
        this.listeners[event] = this.listeners[event].filter(cal => {
            return cal !== callback;
        });
    }
}

export default new EventBus();
