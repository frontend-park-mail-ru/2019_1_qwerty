import View from './View.js';
import template from '../components/Notification/Notification.tmpl.xml';

export default class NotificationView extends View {
    constructor ({
        parent = document.body,
        nameOfView = '',
        parentView = null
    }) {
        super({
            parent,
            nameOfView,
            parentView
        });
        this.onClick = this.onClick.bind(this);
        this._exitIcon = null;
    }

    onClick (event) {
        event.preventDefault();

        this.elem.style.display = 'none';
    }

    render () {
        this.parent.innerHTML = template();
        this.elem = document.querySelector('[data-section="notification"]');

        this._exitIcon = document.querySelector('.notification__exit-icon');
        this._exitIcon.addEventListener('click', this.onClick);
    }

    onDestroy () {
        this._exitIcon.removeEventListener('click', this.onClick);
    }

    set display (data) {
        this.elem.style.display = data;
    }

    get display () {
        return this.elem.style.display;
    }
}
