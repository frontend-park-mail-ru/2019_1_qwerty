import View from './View.js';

export default class ButtonView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = 'Button',
        title = '',
        type = '',
        parentView,
        name = ''
    }) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
        this.type = type;
        this.title = title;
        this.name = name;
    }

    render () {
        this.parent.innerHTML = window.fest['components/Button/Button.tmpl'](this);

        this.elem = document.querySelector(`[name='${this.name}']`);

        this.setEvents();
    }
}
