export default class SignXComponent {
    constructor({
                parent = document.body,
                isSignup = false
                } = {}){
        this._parent = parent;
        this._isSignup = isSignup;
    }

    render() {
        this._parent.innerHTML = window.fest["components/SignX/SignX.tmpl"](this._isSignup);
    }
}