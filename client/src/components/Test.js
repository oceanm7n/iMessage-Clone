import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleClick1 = () => {

        const token = this.props.auth.token;
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        if (token) 
            config.headers['x-auth-token'] = token;
        
        const body = {
            message: 'Hi!'
        };

        axios
            .post('/api/messages/new_message/5d0b65b0e1a8a47f856a7e48', body, config)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.response.data))
    }

    handleClick2 = () => {
        const token = this.props.auth.token;
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        if (token) 
            config.headers['x-auth-token'] = token;

        axios
            .get('/api/messages/recents', config)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    handleClick3 = () => {
        const token = this.props.auth.token;
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        if (token) 
            config.headers['x-auth-token'] = token;
        console.log('3')

        axios
            .get('/api/messages/dialogue/5d10a35920d36fa88ee32f1c', config)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.response.data))
    }

    render() {
        return (
            <div>
                TESTio
                <button onClick={this.handleClick1}>1</button><br/>
                <button onClick={this.handleClick2}>2</button><br/>
                <button onClick={this.handleClick3}>3</button>
            </div>
        );
    }
}

export default connect(state => ({auth: state.auth}), null)(Test);