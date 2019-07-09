import React, {Component} from 'react';
import {connect} from 'react-redux';

import {loginUser} from '../../actions/authActions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: ''
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.props.auth.isAuthenticated) {
            alert('You are already logged in!');
        }
        this.props
            .loginUser({name: this.state.user, password: this.state.password})
            .then(res => {
                if (this.props.auth.isAuthenticated) this.props.history.push('/')
                else alert(this.props.error.message.message);
            })
    }

    render() {
        return (
            <form className='sign-form' onSubmit={this.handleSubmit}>
                <h2 className='sign-header'>Sign in</h2>
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
                    <label className='sign-label'>Password</label>
                    <input
                        type='password'
                        value={this.state.password}
                        onChange={this.handleChange}
                        name='password'
                        className='sign-input'/>
                </fieldset>
                <input type='submit' value='Submit' className='sign-button'/>
            </form>
        )
    }
}

export default connect(state => ({auth: state.auth, error: state.error}), {loginUser})(Login);