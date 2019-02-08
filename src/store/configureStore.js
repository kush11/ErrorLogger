import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import UserReducer from './reducers/user';
import AssessmentReducer from './reducers/AssessmentReducer';
import ReportReducer from './reducers/ReportReducer';
import RewardReducer from './reducers/RewardReducer';
import AssessmentListReducer from './reducers/AssessmentListReducer';

const middleware = applyMiddleware(logger, thunk, promise())

const rootReducer = combineReducers({
    User: UserReducer,
    Assessment: AssessmentReducer,
    Report: ReportReducer,
    Reward: RewardReducer,
    AssessmentList: AssessmentListReducer
}, middleware);

let composeEnhancers = compose;
if (__DEV__) {
    composeEnhancers = window.__REDUX_DEV_TOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers());
}

export default configureStore;