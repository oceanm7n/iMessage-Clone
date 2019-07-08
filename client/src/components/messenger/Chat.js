import React, {Component} from 'react';
import {connect} from 'react-redux';

import MessageInput from './MessageInput';
import MessageContainer from './MessageContainer';
import {getMessages} from '../../actions/messageActions';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    render() {
        return (
            <div className='chat-container'>
                <div className='chat-header'>{this.props.message.user}</div>
                <MessageContainer/>
                <MessageInput/>
            </div>
        );
    }
}

export default connect(state => ({message: state.message}), {getMessages})(Chat);