export default class NotificationComponent {
    constructor ({
        parent = ''
    } = {}) {
        this.parent = parent;
        this.elem = null;
        this.onClick = this.onClick.bind(this);
        this._exitIcon = null;
    }

    destroy () {
        this._exitIcon.removeEventListener('click', this.onClick);
    }

    onClick (event) {
        event.preventDefault();

        this.elem.style.display = 'none';
    }
    render () {
        this.parent.innerHTML = window.fest['components/Notification/Notification.tmpl']();
        this.elem = document.querySelector('[data-section="notification"]');

        this._exitIcon = document.querySelector('.notification__exit-icon');
        this._exitIcon.addEventListener('click', this.onClick.bind(this));
    }

    set display (data) {
        this.elem.style.display = data;
    }

    get display () {
        return this.elem.style.display;
    }
}
