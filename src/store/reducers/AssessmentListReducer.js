import {
    UPDATE_ASSESSMENTSLIST,
} from '../actions/actionTypes';

/* DATA VARIABLES FOR ASSESSMENT LIST REDUCER */
const initialState = {
    assessmentsList: []
}

const AssessmentListReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ASSESSMENTSLIST: {
            state = { ...state, assessmentsList: action.payload }
            break;
        }
    }
    return state;
}

export default AssessmentListReducer;