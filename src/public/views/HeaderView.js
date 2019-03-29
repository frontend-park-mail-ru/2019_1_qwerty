import AjaxModule from '../modules/ajax.js';
// import ButtonComponent from "../components/Button/Button";

import ButtonView from './ButtonView.js';
import View from './View.js';

const noop = () => null;

export default class HeaderView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = '',
        parentView = null,
        destroy = noop,
        headerTitles = {}
    } = {}) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
        this.elements = {};
        this.destroy = destroy;
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
                callbacks: this.callbacks,
                nameOfView: key,
                parentView: this
            });

            button.render();
            this.elements[key] = button;
        });
    }
}
