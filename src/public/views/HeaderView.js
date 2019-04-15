import ButtonView from './ButtonView.js';
import View from './View.js';

export default class HeaderView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = 'header',
        parentView = null,
        headerTitles = {}
    } = {}) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
        this.elements = {};
        this.headerTitles = headerTitles;
    }

    onDestroy () {
        Object.values(this.elements).forEach((button) => {
            button.onDestroy();
        });
    }

    /**
     * Метод снятия обработчиков
     *
     *@this {MenuComponent}.
     */
    render () {
        this.showHeader(this.headerTitles);
    }

    showHeader (namesAndTitles) {
        const names = Object.keys(namesAndTitles);
        this.parent.innerHTML = window.fest['components/Header/Header.tmpl'](names);
        this.elem = document.querySelector('.header');

        Object.entries(namesAndTitles).forEach(([key, data]) => {
            const parent = document.querySelector(`[data-section="${key}"]`);
            const button = new ButtonView({
                name: key,
                title: data,
                parent,
                callbacks: this.callbacksForView,
                nameOfView: key,
                parentView: this
            });

            button.render();
            this.elements[key] = button;
        });
    }
}
