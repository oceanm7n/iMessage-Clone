import axios from 'axios';
import {
    RECENTS_LOADING,
    RECENT_LOADED,
    RECENT_LOADING_FAIL,
    MESSAGES_LOADED,
    MESSAGES_LOADING,
    MESSAGE_LOADING_FAIL,
    SEND_MESSAGE,
    SEND_MESSAGE_FAIL,
    MESSAGE_SENT,
    GET_ERRORS,
    LOAD_MORE
} from '../actions/types';

import {returnErrors} from './errorActions';

export const getDialogues = () => (dispatch, getState) => {
    dispatch({type: RECENTS_LOADING});
    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    if (token) 
        config.headers['x-auth-token'] = token;
    
    axios
        .get('/api/messages/recents', config)
        .then(res => {
            dispatch({type: RECENT_LOADED, payload: res.data})
        })
        .catch(err => {
            dispatch({type: RECENT_LOADING_FAIL});
            console.log(err)
            dispatch(returnErrors(err.response.message, 500));
        })
}

export const getMessages = (id, user = null, page = 1) => (dispatch, getState) => {
    dispatch({type: MESSAGES_LOADING, payload: {
            user,
            id
        }});

    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    if (token) 
        config.headers['x-auth-token'] = token;

    axios
        .get('/api/messages/dialogue/' + id + `?page=${page}`, config)
        .then(res => {
            if (page === 1) 
                dispatch({
                    type: MESSAGES_LOADED,
                    payload: {
                        messages: res.data,
                        user,
                        user_id: res.data.user_id
                    }
                });
            else 
                dispatch({
                    type: LOAD_MORE,
                    payload: {
                        messages: res.data
                    }
                })
        })
        .catch(err => {
            dispatch({type: MESSAGE_LOADING_FAIL})
            console.log(err);
        })
}

export const sendMessage = (id, body) => (dispatch, getState) => {
    dispatch({type: SEND_MESSAGE});

    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    if (token) 
        config.headers['x-auth-token'] = token;
    
    const requestBody = {
        message: body
    }
    axios
        .post('/api/messages/new_message/' + id, requestBody, config)
        .then(res => {
            const {body, created_on, _id} = res.data.msg;
            dispatch(getDialogues());
            dispatch({
                type: MESSAGE_SENT,
                payload: {
                    body,
                    created_on,
                    id: _id,
                    isMine: true
                }
            })
        })
        .catch(err => {
            dispatch({type: SEND_MESSAGE_FAIL});
            dispatch({type: GET_ERRORS, payload: err.response.data})
            console.log(err);
        })
}