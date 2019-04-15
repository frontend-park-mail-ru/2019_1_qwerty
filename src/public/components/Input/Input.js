
const noop = () => null;

export default class InputComponent {
    /**
     * Конструктор экземпляра InputComponent
     *
     * @param {string} name имя элемента в html
     * @param {string} type тип элемента в html
     * @param {string} placeholder placeholder
     * @param {Boolean} isPassword пароль
     * @param {HTMLElement} parent родительский элемент.
     */
    constructor ({
        name = '',
        type = 'text',
        placeholder = '',
        isPassword = false,
        parent = document.body,

    } = {}) {
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
        this.isPassword = isPassword;
        this.parent = parent;
        this._elem = null;
        this._showIconListener = this._showIconListener.bind(this);
    }

    /**
     * Рисует компонент в родительском элементе
     *
     * @this {ButtonComponent}.
     */
    render () {
        this.parent.innerHTML = window.fest['components/Input/Input.tmpl'](this);

        this._elem = document.querySelector(`input[name='${this.name}']`);
        if (this.isPassword) {
            this._showIcon = document.querySelector('.input__icon');
        }

        this.addEventOnFocus();
        this.showPassword();
    }

    /**
     * Убирает обработчик события у экземпляра
     *
     * @this {ButtonComponent}.
     */
    destroy () {
        this._elem.removeEventListener('focus', this._onFocus);
        if (this.isPassword) {
            this._showIcon.removeEventListener('click', this._showIconListener);
        }
    }

    /**
     * Добавляет обработчик события 'click'  экземпляру
     *
     * @this {ButtonComponent}.
     */
    addEventOnFocus () {
        this._elem.addEventListener('focus', this._onFocus);
    }

    /**
     * Обработчик клика на глазик в пароле
     *
     * @this {ButtonComponent}.
     * @param {EventTarget} event событие
     */
    _showIconListener (event) {
        this._elem.type = this._elem.type === 'password' ? 'text' : 'password';
    };

    /**
     * Добавляет обработчик события 'click'  на глаз экземпляру
     *
     * @this {ButtonComponent}.
     */
    showPassword () {
        if (!this.isPassword) {
            return null;
        }

        this._showIcon.addEventListener('click', this._showIconListener);
    }

    /**
     * Setter для callback
     *
     * @this {ButtonComponent}
     * @param {Fucntion} callback
     */
    set onFocus (callback) {
        this._onFocus = (event) => {
            event.preventDefault();

            callback(event);
        };
    }

    /**
     * Getter для callback
     *
     * @this {ButtonComponent}
     */
    get onFocus () {
        return this._onFocus;
    }
}
