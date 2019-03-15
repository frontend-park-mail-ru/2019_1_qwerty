const noop = () => null;

export default class ButtonComponent {
    /**
     * Создает экземпляр класса ButtonComponent
     *
     * @constructor
     * @this {ButtonComponent}
     * @param {string} name имя кнопки в html
     * @param {string} type тип кнопки в html
     * @param {HTMLElement} parent родительский элемент
     * @param {Function} onClick callback-функция.
     */
    constructor ({
        name = '',
        title = '',
        type = '',
        parent = document.body,
        onClick = noop
    } = {}) {
        this.type = type;
        this.title = title;
        this.parent = parent;
        this.name = name;
        this._elem = null;
        this.onClick = onClick;
    }

    destroy () {
        this._elem.removeEventListener('click', this.onClick);
    }

    /**
     * Рисует компонент в родительском элементе
     *
     * @this {ButtonComponent}.
     */
    render () {
        this.parent.innerHTML = window.fest['components/Button/Button.tmpl'](this);

        this._elem = document.querySelector(`[name='${this.name}']`);

        this._elem.addEventListener('click', this.onClick);
    }
}