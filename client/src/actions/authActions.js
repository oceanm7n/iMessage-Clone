import axios from 'axios';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS
} from '../actions/types';
import {returnErrors} from './errorActions'

export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING});

    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    if (token) 
        config.headers['x-auth-token'] = token;
    
    axios
        .get('/api/auth/user', config)
        .then(res => {
            dispatch({type: USER_LOADED, payload: res.data})
        })
        .catch(err => {
            if (err.response) 
                dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR})
        })
}

export const logout = () => dispatch => {
    dispatch({type: LOGOUT_SUCCESS});
    window.location.href = '/';
}

export const registerUser = ({name, email, password}) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Request body
    const body = JSON.stringify({name, email, password});

    return axios
        .post('/api/users', body, config)
        .then(res => {
            dispatch({type: REGISTER_SUCCESS, payload: res.data});
            const token = res.data.token;
            localStorage.setItem('token', token)
            return res;
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({type: REGISTER_FAIL});
            return err;
        });
}

export const loginUser = ({name, password}) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({name, password});

    return axios
        .post('/api/auth', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
            return res;
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
            dispatch({type: LOGIN_FAIL});
            return err;
        })
}