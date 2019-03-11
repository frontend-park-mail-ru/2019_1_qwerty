
export default class FileInputComponent {
    constructor ({
        parent = null,
        title = ''
    }) {
        this.title = title;
        this._elem = null;
        this.parent = parent;
        this.file = null;
    }

    addFile () {
        event.preventDefault();

        this.file = this._elem.files[0];
    }
    destroy () {
        this._elem.removeEventListener('change', this.addFile);
    }

    render () {
        this.parent = window.fest['components/FileInput/FileInput.tmpl'](this.title);

        this._elem = document.querySelector('inputfile');

        this._elem.addEventListener('change', this.addFile);
    }
}