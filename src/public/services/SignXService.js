import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';
import { WS_NICKNAME } from '../config.js';

export default class SignXService {
    requestForSignupOrSignin ({ path, body }) {
        AjaxModule.doFetchPost({
            path: path,
            body: body
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Incorrect Nickname and/or password');
                    error.response = response;
                    throw error;
                }
                global.WS_NICKNAME = response.nickname;
                EventBus.emit('signx-model:after-success-submit');
            })
            .catch(e => {
                EventBus.emit('signx-model:add-errors', e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
    }
}
