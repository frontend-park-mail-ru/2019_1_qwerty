import AjaxModule from '../../modules/ajax.js';
import ButtonComponent from '../Button/Button.js';

const noop = () => null;

export default class HeaderComponent {
    /**
     * Конструктор
     *
     * @this {HeaderComponent}
     * @param {HTMLElement} parent родительский элемент
     * @param {Object} pages объект функций страниц
     * @param {Function} callback callback-функция
     */
    constructor ({
        parent = document.body,
        pages = {},
        callback = noop
    } = {}) {
        this._parent = parent;
        this.pages = pages;
        this.buttons = {};
        this._elements = {};
        this._elem = null;
        this.namesAndTitles = null;
        this.onClickItem = this.onClickItem.bind(this);
        this.menuDestroy = callback;
    }

    /**
     * Обработчик события 'click'
     *
     * @this {MenuComponent}
     * @param {EventTarget} event
     */
    onClickItem (event) {
        const currentTarget = event.target;

        if (!(currentTarget instanceof HTMLButtonElement)) {
            return;
        }

        const name = currentTarget.name;
        const button = this._elements[name];

        if (!button) {
            return;
        }

        event.preventDefault();

        button.onClick();

        this.menuDestroy();
    };

    destroy () {
        Object.values(this._elements).forEach((button) => {
            this._parent.removeEventListener('click', button.onClick);
        });
    }

    /**
     * Метод снятия обработчиков
     *
     *@this {MenuComponent}.
     */
    render () {
        AjaxModule.doGet({
            path: '/user/check',
            callback: (xhr) => {
                this.namesAndTitles = {
                    signin: 'Sign In',
                    signup: 'Sign Up'
                };

                if (xhr.status === 200) {
                    this.namesAndTitles = {
                        profile: 'My Profile',
                        logout: 'Log Out'
                    };
                }

                const names = Object.keys(this.namesAndTitles);
                this._parent.innerHTML = window.fest['components/Header/Header.tmpl'](names);

                this._elem = document.querySelector('.header');

                Object.entries(this.namesAndTitles).forEach(([key, data]) => {
                    const parent = document.querySelector(`[data-section="${key}"]`);
                    const button = new ButtonComponent({
                        name: key,
                        title: data,
                        parent,
                        onClick: this.pages[key]
                    });

                    button.render();

                    this._elements[key] = button;
                    this._elem.addEventListener('click', this.onClickItem);
                });
            }
        });
    }
}
