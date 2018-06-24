import {
    CREATION_REQUESTED,
    CREATION_FAILED,
    CREATION_SUCCEDDED,
    FETCHING_SUCCEDED,
    FETCHING_FAILED
} from '../actionsTypes/users';

import {CLEAR_STORE} from '../actionsTypes/entireStore';

const initialState = {

    created: false,
    creating: false,
    creationError: null,

    fetched: false,
    fetchingError: false,
    users: []
};

export default function usersReducer(state = initialState, action) {

    const { payload } = action;
    const { typingUsers } = state;

    switch (action.type) {

        case CREATION_REQUESTED: {

            return {
                ...state,
                created: false,
                creating: true,
                creationError: null
            };
        }
            
        case CREATION_SUCCEDDED: {

            return {
                ...state,
                created: true,
                creating: false,
                creationError: null
            };
        }
            
        case CREATION_FAILED: {

            return {
                ...state,
                created: false,
                creating: false,
                creationError: payload
            };
        }
            
        case FETCHING_SUCCEDED: {

            return {
                ...state,
                fetched: true,
                updatingError: false,
                users: payload
            };
        }       

        case FETCHING_FAILED: {

            return {
                ...state,
                fetchingError: true
            };
        }
        
        case CLEAR_STORE: {

            return {
                ...initialState
            };
        }

        default: {

            return state;
        }      
    }
}