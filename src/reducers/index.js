import { combineReducers } from 'redux';

import auth from './auth';
import users from './users';
import messages from './messages';
import socket from './socket';

export default combineReducers({
    auth,
    users,
    messages,
    socket
});