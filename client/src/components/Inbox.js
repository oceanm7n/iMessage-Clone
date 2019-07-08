import React, {Component} from 'react';
import {connect} from 'react-redux';
import './messenger/index.css';

import Chat from './messenger/Chat';

import {getDialogues, getMessages} from '../actions/messageActions';
import RecentDialogue from './messenger/RecentDialogue';
import Controls from './controls/Controls';

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this
            .props
            .getDialogues();
    }

    handleDialogueClick = (id, user) => {
        this
            .props
            .getMessages(id, user);
    }

    render() {
        return (
            <div className='inbox-container'>
                <div className='recent-container'>
                    <Controls />
                    {this
                        .props
                        .message
                        .recents
                        .map(recent => (<RecentDialogue recent={recent} key={recent.id}/>))}
                </div>
                <Chat/>
            </div>
        );
    }

}

export default connect(state => ({auth: state.auth, message: state.message}), {getDialogues, getMessages})(Inbox);