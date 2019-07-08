import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import messageReducer from './messageReducer';
import controlsReducer from './controlsReducer';

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    message: messageReducer,
    controls: controlsReducer
});