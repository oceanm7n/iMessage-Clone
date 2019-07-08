import React, {Component} from 'react';
import Message from './Message';
import {connect} from 'react-redux';
import {getMessages, getDialogues} from '../../actions/messageActions';

class MessageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    updateScroll = () => {
        this
            .messagesEnd
            .scrollIntoView({behavior: "smooth"})
    }

    componentDidMount() {
        // setInterval(() => {
        //     if (this.props.message.dialogue_id) {
        //         this.props.getMessages(this.props.message.dialogue_id, this.props.message.user)
        //         this.props.getDialogues();
        //     }
        // }, 2000);
    }

    loadMore = () => {
        const id = this.props.message.dialogue_id;
        const user = this.props.message.user;
        const page = this.props.message.page;
        this
            .props
            .getMessages(id, user, page);
    }

    render() {
        return (
            <div className='message-container'>
                <div
                    style={{
                    float: "left",
                    clear: "both"
                }}
                    ref={(el) => {
                    this.messagesEnd = el;
                }}></div>
                {this.props.message.messages.length === 0 && this.props.message.user
                    ? <div className='message-container-alert'>You don't have any messages yet.<br/><br/>Be the first ot start a conversation!</div>
                    : ''
            }
            {
                this
                    .props
                    .message
                    .messages
                    .map((message, index, array) => (
                        <React.Fragment key={message.id}>
                            <Message message={message}/> {index === array.length - 1 && array.length >= 20
                                ? <button className='navbar-btn' onClick={this.loadMore}>Load more</button>
                                : ''}
                        </React.Fragment>
                    ))
            } </div>
        );
    }
}

export default connect(state => ({message: state.message}), {getMessages, getDialogues})(MessageContainer);