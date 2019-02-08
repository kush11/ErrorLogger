import {
    UPDATE_ASSESSMENTSLIST
} from '../actions/actionTypes';



export const updateAssessmentsList = (data) => {
    return {
        type: UPDATE_ASSESSMENTSLIST,
        payload: data
    }
};