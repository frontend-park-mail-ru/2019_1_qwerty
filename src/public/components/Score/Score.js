import AjaxModule from '../../modules/ajax.js';
import ButtonComponent from '../Button/Button.js';
export default class ScoreComponent {
    constructor ({
        parent = document.body
    } = {}) {
        this._parent = parent;
        this.currentOffset = 0;
        this._elements = [];
        this.scoreboard = [];
    }

    render () {
        this._parent.innerHTML = fest['components/Score/Score.tmpl'](this.scoreboard);
        let prev = document.querySelector('[data-section="Prev10"]');
        let next = document.querySelector('[data-section="Next10"]');

        const prevButton = new ButtonComponent({
            parent: prev,
            name: 'Prev 10',
            title: 'Prev 10',
            onClick: this.getNext.bind(this, -10)
        });

        const nextButton = new ButtonComponent({
            parent: next,
            name: 'Next 10',
            title: 'Next 10',
            onClick: this.getNext.bind(this, 10)
        });

        prevButton.render();
        nextButton.render();
        this._elements.push(prevButton);
        this._elements.push(nextButton);
    }

    onDestroy () {
        this._elements.forEach((component) => {
            component.destroy();
        });
    }

    /**
     * Обращается к BACKEND и строит html таблицу результатов на основе ответа
     *
     * @param  {} startIndex=0 - integer - Смещение относительно текущего начала.
     */
    getNext (startIndex = 0) {
        const url = '/score?offset=' + (this.currentOffset + startIndex).toString();

        AjaxModule.doFetchGet({
            path: url
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Can not load score');
                }
                return response.json();
            })
            .then(response => {
                this.scoreboard = response;
                this.currentOffset += startIndex;
            })
            .catch(e => {
                console.log(`Error: ${e.message}`);
                this.onDestroy();
                this.render();
            });
    }
}
