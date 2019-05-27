import View from './View.js';
import template from '../components/FileInput/FileInput.tmpl.xml';

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
        this.parent.innerHTML = template(this.title);
        this.elem = document.querySelector('.inputfile');

        this.setEvents();
    }
}
