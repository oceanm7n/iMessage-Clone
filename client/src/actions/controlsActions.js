import axios from 'axios';
import {GET_USERS} from '../actions/types';
import {getMessages} from './messageActions';
export const getAllUsers = () => dispatch => {
    axios
        .get('/api/users/all_users')
        .then(res => {
            dispatch({type: GET_USERS, payload: res.data})
        })
}

export const openDialogue = (newUser) => (dispatch, getState) => {
    const users = getState()
        .controls
        .users
        .map(user => user.name);

    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    if (token) 
        config.headers['x-auth-token'] = token;
    
    const userIndex = users.indexOf(newUser)
    if (userIndex > -1 && newUser !== getState().auth.user.name) {
        // User exists
        axios
            .post('/api/messages/new_dialogue/'+getState().controls.users[userIndex]._id, {}, config)
            .then(res => {
                dispatch(getMessages(res.data.dialogue_id, newUser));
            })
    }
    else if (newUser === getState().auth.user.name) {
        alert("You can't message yourself!")
    }
    else {
        alert('No such user');
    }
}