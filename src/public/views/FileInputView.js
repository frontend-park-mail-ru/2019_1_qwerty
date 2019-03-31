import View from './View.js';

export default class FileInputView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = '',
        parentView = null,
        title = ''
    }) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
        this.title = title;
    }

    render () {
        this.parent.innerHTML = window.fest['components/FileInput/FileInput.tmpl'](this.title);

        this.elem = document.querySelector('.inputfile');

        this.setEvents();
    }
}
