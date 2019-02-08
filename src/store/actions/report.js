import { UPDATE_ASSESSMENT_REPORT } from '../actions/actionTypes';

export const updateAssessmentReport = (data) => {
    return {
        type: UPDATE_ASSESSMENT_REPORT,
        payload: data
    }
};