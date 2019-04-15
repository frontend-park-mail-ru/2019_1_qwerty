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
        this.menuDestroy = callback;
        this._path = '/user/check';
    }

    destroy () {
        Object.values(this._elements).forEach((button) => {
            button.destroy();
        });
    }

    /**
     * Метод снятия обработчиков
     *
     *@this {MenuComponent}.
     */
    render () {
        AjaxModule.doFetchGet({
            path: this._path
        })
            .then(response => {
                this.namesAndTitles = {
                    signin: 'Sign In',
                    signup: 'Sign Up'
                };

                if (response.ok) {
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
                        onClick: (event) => {
                            event.preventDefault();
                            this.pages[key]();
                            this.menuDestroy();
                        }
                    });

                    button.render();
                    this._elements[key] = button;
                });
            })
            .catch(e => {
                console.log(`Error: ${e.message}`);
            });
    }
}
