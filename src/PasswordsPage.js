import {Component} from "react";
import { updatePasswords } from "./skydb";

import './styles.scss';
import './modal.scss';

class PasswordsPage extends Component {
    state = {
        searchTerm: '',
        modal: {
            active: false,
            form: {
                website: '',
                url: '',
                username: '',
                password: '',
                category: '',
                websiteError: '',
                urlError: '',
                usernameError: '',
                passwordError: ''
            },
            editingID: -1
        },
        passwords: [
            {
                website: "Google",
                url: "http://www.google.com",
                username: "johndoe90",
                password: "lol1234",
                category: "search"
            },
            {
                website: "Facebook",
                url: "http://www.facebook.com",
                username: "johndoe90",
                password: "lol1234",
                category: "social"
            }
        ]
    }

    //also resets the form
    closeModal = () => {
        this.setState({
            modal: {
                searchTerm: null,
                active: false,
                form: {
                    websiteName: '',
                    url: '',
                    username: '',
                    password: '',
                    category: '',
                    websiteError: '',
                    urlError: '',
                    usernameError: '',
                    passwordError: ''
                },
                editingID: -1
            }
        })
    }

    copyToClipboard = (fieldName) => {
        const copyText = document.getElementById(fieldName);

        copyText.select();
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");
    }

    //pass in the index of an existing value to edit...
    openModal = (editingID) => {
        let form = {};

        if (editingID >= 0) {
            form = {
                website: this.state.passwords[editingID].website,
                url: this.state.passwords[editingID].url,
                username: this.state.passwords[editingID].username,
                password: this.state.passwords[editingID].password,
                category: this.state.passwords[editingID].category,
            }
        }

        this.setState({
            modal: {
                active: true,
                editingID: editingID ? editingID : -1,
                form
            }
        });
    }

    logout = () => {
        this.props.logout();
    }

    handleSearchChange = (e) => {
        e.preventDefault();
        this.setState({searchTerm: e.target.value})
    }

    handleFieldChange = (e, fieldName) => {
        e.preventDefault();
        this.setState({
            modal: {
                ...this.state.modal,
                form: {
                    [fieldName]: e.target.value
                }
            }
        });
    }

    getFilteredPasswords = (searchTerm) => {
        if(!this.state.passwords) {
            return [];
        }

        if (!searchTerm || searchTerm === '') {
            return this.state.passwords;
        }

        return this.state.passwords.filter(
            password => {
                return password.website.includes(searchTerm) || password.url.includes(searchTerm)
            }
        )
    }

    getCategories = () => {
        return [
            ...new Set(this.state.passwords.map(
                password => password.category
            ).filter(category => category != null && category !== ''))
        ];
    }

    addPassword = () => {
        const newPassword = {
            website: "Youtube",
            url: "http://www.youtube.com",
            username: "johndoe90",
            password: "lol1234",
            category: "social"
        };

        const newPasswords = [...this.state.passwords, newPassword];

        try {
            updatePasswords(this.state.passwords, 'lol');
            this.setState({passwords: newPasswords});
        } catch(err) {
            console.error(err);
        }
    }

    editPassword = () => {
        const newPassword = {
            website: this.state.modal.form.website,
            url: this.state.modal.form.url,
            username: this.state.modal.form.username,
            password: this.state.modal.form.password,
            category: this.state.modal.form.category
        };

        let passwords = [...this.state.passwords];
        passwords[this.state.modal.editingID] = newPassword;
        this.setState({passwords, modal: { form: { editingID: -1, active: false }}});
    }

    componentWillMount() {
        this.setState({passwords: this.props.passwords});
    }

    render() {
        return (
            <div className="passwords-container">
                <div id="myModal" className={`modal ${this.state.modal.active && "modal-visible"}`}>
                    <div className="modal-content">
                        <span className="close" onClick={() => this.closeModal()}>&times;</span>
                        <h4 className="modal-title">{this.state.modal.editingID > -1 ? 'Edit' : 'Add'} Password</h4>
                        <input name="website" onChange={e => this.handleFieldChange(e, "website")} value={this.state.modal.form && this.state.modal.form.website} placeholder="Website name" className="modal-field"/>
                        <input name="url" onChange={e => this.handleFieldChange(e, "url")} value={this.state.modal.form && this.state.modal.form.url} placeholder="Website link" className="modal-field"/>
                        <input name="username" value={this.state.modal.form && this.state.modal.form.username} onChange={e => this.handleFieldChange(e, "username")} placeholder="Username" className="modal-field"/>
                        <input name="password" value={this.state.modal.form && this.state.modal.form.password} onChange={e => this.handleFieldChange(e, "password")} type="password" placeholder="Password" className="modal-field"/>
                        <input name="category" value={this.state.modal.form && this.state.modal.form.category} onChange={e => this.handleFieldChange(e, "category")} placeholder="Category" className="modal-field"/>
                        {this.state.modal.editingID < 0 && (
                            <button className="modal-add-submit" onClick={() => this.addPassword()}>Add Website Details</button>
                        )}
                        {this.state.modal.editingID >= 0 && (
                            <div>
                                <button className="modal-edit-submit" onClick={() => this.editPassword()}>Edit Website Details</button>
                                <button className="modal-delete">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="nav-bar">
                    <img src="https://www.latermicamalaga.com/book/files/uploads/logo-placeholder@2x.png" height="32"/>
                    <button className="logout" onClick={() => this.logout()}>
                        Log out
                    </button>
                </div>
                {this.state.passwords.length > 0 && (
                    <div className="field-parent">
                        <fieldset className="field-container">
                            <input name="search" id="search" type="text" placeholder="Search..." className="field"
                                   onChange={e => this.handleSearchChange(e)} value={this.state.searchTerm}/>
                            <div className="icons-container">
                                <div className="icon-search"/>
                            </div>
                        </fieldset>
                    </div>
                )}
                <div className="flex-grid">
                    {this.state.passwords.length < 1 && (
                        <div>
                            You don't have any passwords in your vault yet. Click the Add button to create one.
                        </div>
                    )}
                    {this.state.passwords.length > 0 && this.getFilteredPasswords(this.state.searchTerm).length < 1 && (
                        <div>
                            No websites matching that search term.
                        </div>
                    )}
                    {this.getFilteredPasswords(this.state.searchTerm).map(
                        (password, index) => (
                            <div className="col">
                                <h4>{password.website}</h4>
                                <div className="website-link">
                                    <a href={password.url}>{password.url}</a>
                                </div>
                                <input id={`username-${index}`} className="copy-field" name="username" placeholder="username" value={password.username}/>
                                <button className="copy-data" onClick={() => this.copyToClipboard(`username-${index}`)}>Copy</button>
                                <input id={`password-${index}`} className="copy-field" name="password" type="password" placeholder="password" value={password.password}/>
                                <button className="copy-data" onClick={() => this.copyToClipboard(`password-${index}`)}>Copy</button>
                                {password.category && password.category.length > 1 && (
                                    <input name="category" placeholder="category" value={password.category}/>
                                )}
                                <div className="button-holder">
                                    <button onClick={() => this.openModal(1)}>Edit</button>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <button className="add-password" onClick={() => this.openModal(-1)}>+</button>
            </div>
        );
    }
}

export default PasswordsPage;
