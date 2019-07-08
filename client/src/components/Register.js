import React, {Component} from 'react';
import {connect} from 'react-redux';

import {registerUser} from '../actions/authActions';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            email: '',
            password: '',
            redirect: false,
            message: ''
        };
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.auth.isAuthenticated) {
            alert('You have to log out to register a new user.');
        } else {
            this
                .props
                .registerUser({name: this.state.user, email: this.state.email, password: this.state.password})
                .then(res => {
                    if (this.props.auth.isAuthenticated) {
                        this.props.history.push('/');
                    }
                    else {
                        alert(this.props.error.message.message);
                    }
                });
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <form className='sign-form' onSubmit={this.handleSubmit}>
                <h2 className='sign-header'>Register</h2>
                <fieldset>
                    <label className='sign-label'>Username
                    </label>
                    <input
                        type='text'
                        value={this.state.user}
                        onChange={this.handleChange}
                        name='user'
                        className='sign-input'/>
                </fieldset>
                <fieldset>
                    <label className='sign-label'>Email</label>
                    <input
                        type='email'
                        value={this.state.email}
                        onChange={this.handleChange}
                        name='email'
                        className='sign-input'/>
                </fieldset>
                <fieldset>
                    <label className='sign-label'>Password</label>
                    <input
                        type='password'
                        value={this.state.password}
                        onChange={this.handleChange}
                        name='password'
                        className='sign-input'/>
                </fieldset>
                <input type='submit' className='sign-button'/>
            </form>
        );
    }
}

export default connect(state => ({auth: state.auth, error: state.error}), {registerUser})(Register);