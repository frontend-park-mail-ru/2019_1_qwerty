import View from './View.js';
import ButtonView from './ButtonView.js';
import template from '../components/Score/Score.tmpl.xml';
import { GET_SCORE } from '../config.js';

export default class ScoreboardView extends View {
    constructor ({
        parent,
        callbacks,
        nameOfView = 'Scoreboard',
        scoreboard = []
    }) {
        super({
            parent,
            callbacks,
            nameOfView
        });
        this.path = GET_SCORE;
        this.elements = {};
        this.scoreboard = scoreboard;
    }

    updateScore (scoreboard) {
        this.scoreboard = scoreboard;
        this.onDestroy();
        this.render();
    }

    onDestroy () {
        Object.values(this.elements).forEach((component) => {
            component.onDestroy();
        });

        super.onDestroy();
    }

    render () {
        this.parent.innerHTML = template(this.scoreboard);
        let prevButtonParent = document.querySelector('[data-section="Prev"]');
        const prevButton = new ButtonView({
            name: 'prev',
            title: 'prev',
            parent: prevButtonParent,
            type: 'button',
            callbacks: this.callbacksForView,
            parentView: this,
            nameOfView: 'prev'
        });
        prevButton.render();
        this.elements.prev = prevButton;

        let closeButtonParent = document.querySelector('[data-section="Close"]');
        const closeButton = new ButtonView({
            name: 'close',
            title: 'close',
            parent: closeButtonParent,
            type: 'button',
            callbacks: this.callbacksForView,
            parentView: this,
            nameOfView: 'close'
        });
        closeButton.render();
        this.elements.close = closeButton;

        let nextButtonParent = document.querySelector('[data-section="Next"]');
        const nextButton = new ButtonView({
            name: 'next',
            title: 'next',
            parent: nextButtonParent,
            type: 'button',
            callbacks: this.callbacksForView,
            parentView: this,
            nameOfView: 'next'
        });
        nextButton.render();
        this.elements.next = nextButton;

        this.setEvents();
    }
}
