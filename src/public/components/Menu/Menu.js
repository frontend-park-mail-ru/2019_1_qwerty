import ButtonComponent from '../Button/Button.js';
import HeaderComponent from '../Header/Header.js';

export default class MenuComponent {
    /**
     * Конструктор
     *
     * @this {MenuComponent}
     * @param {HTMLElement} parent родительский элемент
     * @param {Object} pages объект со страницами
     */
    constructor ({
        parent = document.body,
        pages = {}
    } = {}) {
        this._parent = parent;
        this.menuItems = {
            singleplayer: 'Singleplayer',
            multiplayer: 'Multiplayer',
            score: 'Scoreboard'
        };
        this.pages = pages;
        this.header = null;
        this.mainMenuButtons = {};
        this._elem = null;
    }


    /**
     * Метод снятия обработчиков
     *
     *@this {MenuComponent}.
     */
    onDestroy () {
        Object.values(this.mainMenuButtons).forEach((button) => {
            button.destroy();
        });

        this.header.destroy();
    }

    /**
     * Метод отображения компонента
     *
     * @this {MenuComponent}
     */
    render () {
        const elements = Object.keys(this.menuItems);
        this._parent.innerHTML = window.fest['components/Menu/Menu.tmpl'](elements);

        this._elem = document.querySelector('.menu-main');

        const headerParent = document.querySelector('.menu-header__item_width_m');
        this.header = new HeaderComponent({
            parent: headerParent,
            pages: this.pages,
            callback: this.onDestroy.bind(this)
        });
        this.header.render();

        Object.entries(this.menuItems).forEach(([key, title]) => {
            const parent = document.querySelector(`[data-section="${key}"]`);
            const button = new ButtonComponent({
                title,
                name: key,
                parent,
                onClick: (event) => {
                    event.preventDefault();
                    this.pages[key]();
                    this.onDestroy();
                }
            });
            this.mainMenuButtons[key] = button;
            button.render();
        });
    }
}
