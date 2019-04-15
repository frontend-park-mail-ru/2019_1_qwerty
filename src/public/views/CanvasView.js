import View from './View.js';

export default class CanvasView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = 'canvas',
        parentView
    }) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
    }

    render () {
        this.parent.innerHTML = window.fest['components/Canvas/Canvas.tmpl']();

        this.elem = document.querySelector(`.canvas`);
        console.log('size of canvas: ', this.elem.width, this.elem.height);
        this.setEvents();
    }
}
