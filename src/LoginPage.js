import './styles.scss';
import {fetchPasswords} from "./skydb";
import {Component} from "react";

class Search extends Component {
    state = {
        displayError: false,
        key: ''
    }

    logIn = (e) => {
        e.preventDefault();

        if(this.state.key && this.state.key.length > 0) {
            this.props.login(this.state.key);

            fetchPasswords('some key').then(
                items => console.log("items " + items)
            ).catch(
                err => console.error(err)
            )
        } else {
            this.setState({ displayError: true })
        }
    }

    generateKey = (e, keySize) => {
        e.preventDefault();
        const hexKey = [...Array(keySize)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        this.setState({key: hexKey});
    }


    updateKey = (e) => {
        this.setState({key: e.target.value});
    }

    render() {
        return (
            <form>
                <div className="main-container">
                    <div className="image-container">
                        <img src="https://cdn1.iconfinder.com/data/icons/unigrid-phantom-security-vol-1/60/013_025_lock_padlock_password_secure_private_protection_3-512.png"/>
                    </div>
                    <div className="welcome-text">
                        Skyleton Key encrypts and stores your passwords in the cloud. All you need to remember is your
                        Skyleton Key Phrase to access your passwords securley on any device!
                    </div>
                    <div className="field-parent">
                        <fieldset className="field-container">
                            <input id="key" name="key" type="text" placeholder="Enter your Skyleton Key Phrase..."
                                   className="field" value={this.state.key} onChange={this.updateKey}/>
                            {this.state.displayError && (
                                <div className="error-text">Please enter your keyphrase to log in...</div>
                            )}
                        </fieldset>
                    </div>
                    <div className="button-container">
                        <button className="half-width" type="submit" onClick={e => this.logIn(e)}>Log In</button>
                        <button className="half-width" onClick={(e) => this.generateKey(e, 100)}>Generate Key Phrase</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default Search;
