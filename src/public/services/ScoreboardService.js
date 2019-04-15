import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';
import { GET_SCORE } from '../config.js';

export default class ScoreboardService {
    /**
     * Обращается к BACKEND и строит html таблицу результатов на основе ответа
     *
     * @param  {} startIndex=0 - integer - Смещение относительно текущего начала.
     */
    getScore (data) {
        const url = GET_SCORE + (data.position + data.offset).toString();

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
                this.currentPosition = data.position + data.offset;
                EventBus.emit('scoreboard-model:update-score-data', { position: this.currentPosition, scoresheet: response });
            })
            .catch(e => {
                console.log(`Error: ${e.message}`);
            });
    }
}
