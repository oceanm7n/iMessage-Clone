import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getMessages} from '../../actions/messageActions';

class RecentDialogue extends Component {

    handleDialogueClick = (id, user) => {
        this
            .props
            .getMessages(id, user);
    }

    render() {
        const recent = this.props.recent;
        let className = 'recent-item';
        if (this.props.message.user === recent.user) className += ' recent-item-active'

        return (
            <div
                className={className}
                onClick={() => this.handleDialogueClick(recent.id, recent.user)}>
                <div className='recent-item-user'>{recent.user}</div>
                <div className='recent-item-message'>{recent.message}</div>
            </div>
        );
    }
}

export default connect(state => ({auth: state.auth, message: state.message}), {getMessages})(RecentDialogue);