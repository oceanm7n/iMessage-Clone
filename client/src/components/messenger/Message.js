import React, {Component} from 'react';
import './message-container.css';

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const {isMine, body} = this.props.message;
        return (
            <div
                className={'message' + (isMine
                ? ' message-mine'
                : '')}>
                {body}</div>
        );
    }
}

export default Message;