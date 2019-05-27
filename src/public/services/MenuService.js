import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';

import { USER_CHECK, LOG_OUT } from '../config.js';

export default class MenuService {
    requestForUserAuth () {
        if (!window.navigator.onLine) {
            EventBus.emit('model:user-auth-info',{
                signin: 'Sign In',
                signup: 'Sign Up'
            });
            return;
        }
        AjaxModule.doFetchGet({
            path: USER_CHECK
        })
            .then(response => (response.ok) ? {
                profile: 'My Profile',
                logout: 'Log Out'
            } : {
                signin: 'Sign In',
                signup: 'Sign Up'
            })
            .then(res => {
                EventBus.emit('model:user-auth-info', res);
            })
            .catch(e => {
                console.log(`Error: ${e.message}`);
            });
    }

    logOut () {
        AjaxModule.doFetchGet({
            path: LOG_OUT
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Can not logout');
                    error.response = response;
                    throw error;
                }
                EventBus.emit('menu:user-auth');
            })
            .catch(e => {
                this._addFormError(e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
    }
}
