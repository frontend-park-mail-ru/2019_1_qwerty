import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';
import { GET_SCORE } from '../config.js';

export default class ScoreboardService {
    constructor () {
        this.currentPosition = 0;
        this.scoresheetsAmount = 0;
    }
    /**
     * Обращается к BACKEND и строит html таблицу результатов на основе ответа
     *
     * @param  {} startIndex=0 - integer - Смещение относительно текущего начала.
     */
    getScore (offset = 0) {
        const url = GET_SCORE + (this.currentPosition + offset).toString();

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
                this.currentPosition += offset;
                EventBus.emit('scoreboard-model:update-score-data', response);
            })
            .catch(e => {
                console.log(`Error: ${e.message}`);
            });
    }
}
