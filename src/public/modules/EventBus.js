class EventBus {
    constructor () {
        this.listeners = {};
    }

    on (event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit (event, data) {
        console.log(this.listeners);
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
