
const noop = () => null;

export default class FileInputComponent {
    constructor ({
        parent = null,
        title = '',
        callback
    }) {
        this.title = title;
        this._elem = null;
        this.parent = parent;
        this.file = null;
        this.callback = null;
    }

    addFile () {
        event.preventDefault();

        this.file = this._elem.files[0];
        if (this._callback) {
            this._callback();
        }
    }

    destroy () {
        this._elem.removeEventListener('change', this.addFile);
    }

    render () {
        this.parent.innerHTML = window.fest['components/FileInput/FileInput.tmpl'](this.title);

        this._elem = document.querySelector('.inputfile');

        this._elem.addEventListener('change', this.addFile.bind(this));
    }

    set onChange (func) {
        this._callback = func;
    }

    get onChange () {
        return this._callback;
    }
}
