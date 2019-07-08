import {
    RECENTS_LOADING,
    RECENT_LOADED,
    RECENT_LOADING_FAIL,
    MESSAGES_LOADED,
    MESSAGES_LOADING,
    MESSAGE_LOADING_FAIL,
    MESSAGE_SENT,
    SEND_MESSAGE,
    SEND_MESSAGE_FAIL,
    LOAD_MORE
} from '../actions/types';

const initialState = {
    recents_loading: false,
    recents: [],
    messages_loading: false,
    messages: [],
    user: null,
    user_id: null,
    dialogue_id: null,
    sending: false,
    page: 1
}

export default function (state = initialState, action) {
    switch (action.type) {
        case RECENTS_LOADING:
            return {
                ...state,
                recents_loading: true,
            }
        case RECENT_LOADED:
            return {
                ...state,
                recents: action.payload,
                recents_loading: false
            }
        case RECENT_LOADING_FAIL:
            return {
                ...state,
                recents: [],
                recents_loading: false,
                user: null
            }
        case MESSAGES_LOADING:
            return {
                ...state,
                messages_loading: true,
                user: action.payload.user,
                dialogue_id: action.payload.id
            }
        case MESSAGES_LOADED:
            return {
                ...state,
                messages_loading: false,
                messages: action.payload.messages.messages,
                user: action.payload.user,
                page: 2,
                user_id: action.payload.user_id
            }
        case LOAD_MORE:
            return {
                ...state,
                page: action.payload.messages.messages.length === 0 ? state.page : state.page + 1,
                messages_loading: false,
                messages: [...state.messages, ...action.payload.messages.messages]
            }
        case MESSAGE_LOADING_FAIL:
            return {
                ...state,
                messages: [],
                messages_loading: false,
                user: null,
                user_id: null
            }
        case SEND_MESSAGE:
            return {
                ...state,
                sending: true
            }
        case MESSAGE_SENT:
            return {
                ...state,
                sending: false,
                messages: [action.payload, ...state.messages]
            }
        case SEND_MESSAGE_FAIL:
            return {
                ...state,
                sending: false
            }
        default:
            return state;
    }
}