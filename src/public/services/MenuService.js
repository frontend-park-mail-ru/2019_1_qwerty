import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';

const noop = () => null;

export default class MenuService {
    requestForUserAuth (path = '') {
        AjaxModule.doFetchGet({
            path
        })
            .then(response => {
                let namesAndTitles = {
                    signin: 'Sign In',
                    signup: 'Sign Up'
                };

                if (response.ok) {
                    namesAndTitles = {
                        profile: 'My Profile',
                        logout: 'Log Out'
                    };
                }
                return namesAndTitles;
            })
            .then(res => {
                EventBus.emit('model:user-auth-info', res);
            })
            .catch(e => {
                console.log(`Error: ${e.message}`);
            });
    }
}
