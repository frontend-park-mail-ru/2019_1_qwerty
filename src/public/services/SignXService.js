import AjaxModule from '../modules/ajax.js';

export default class SignXService {
    requestForSignupOrSignin ({ path, body, onDestroy, afterSuccessSubmit, addFormError }) {
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
                onDestroy();
                afterSuccessSubmit();
            })
            .catch(e => {
                addFormError(e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
    }
}