import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';

import { USER_CHECK } from '../config.js';

export default class MenuService {
    requestForUserAuth () {
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
}
