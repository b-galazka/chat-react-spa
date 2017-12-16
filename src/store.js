import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = applyMiddleware(sagaMiddleware);
const store = createStore(reducer, middlewares);

sagaMiddleware.run(rootSaga);

export default store;