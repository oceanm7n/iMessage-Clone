import React, {Component} from 'react';
import {connect} from 'react-redux';

import {sendMessage} from '../../actions/messageActions';

class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSend = (e) => {
        e.preventDefault();
        const id = this.props.message.user_id;
        if (this.state.message === '') return;
        this.props.sendMessage(id, this.state.message)
        this.setState({message: ''})
    }
    render() {
        if (!this.props.message.user) return null;
        return (
            <div className='message-input-container'>
                <form onSubmit={this.handleSend} className='message-input'>
                    <input type='text' name='message' value={this.state.message} onChange={this.handleChange}/>
                    <button>Send</button>
                </form>
            </div>
        );
    }
}

export default connect(state => ({message: state.message}), {sendMessage})(MessageInput);