import {
    UPDATE_ASSESSMENT_THEME,
    UPDATE_ASSESSMENT_ID,
    EXIT_ASSESSMENT,
    UPDATE_QUESTIONS,
    UPDATE_CURRENTQUESTION,
    IS_NEXT_QUESTION_LOADING,
    UPDATE_CURRENTASSESSMENT,
    UPDATE_ASSESSMENTDETAILS,
    UPDATE_CURRENT_FLOW,
    UPDATE_CURRENT_ANSWER
} from '../actions/actionTypes';


export const setAssessmentType = (type) => {
    return {
        type: UPDATE_ASSESSMENT_THEME,
        payload: type
    }
};
export const updateAssessmentId = (id) => {
    return {
        type: UPDATE_ASSESSMENT_ID,
        payload: id
    }
};
export const exitAssessment = (clear) => {
    return {
        type: EXIT_ASSESSMENT,
        payload: clear
    }
};

export const updateQuestions = (questions) => {
    return {
        type: UPDATE_QUESTIONS,
        payload: questions
    }
};

export const updateCurrentQuestion = (question) => {
    return {
        type: UPDATE_CURRENTQUESTION,
        payload: question
    }
};

export const isNextQuestionLoading = (loading) => {
    return {
        type: IS_NEXT_QUESTION_LOADING,
        payload: loading
    }
};

export const updateCurrentAssessment = (currentAssessment) => {
    return {
        type: UPDATE_CURRENTASSESSMENT,
        payload: currentAssessment
    }
};

export const updateAssessmentDetails = (assessmentDetails) => {
    return {
        type: UPDATE_ASSESSMENTDETAILS,
        payload: assessmentDetails
    }
};
export const updateCurrentFlow = (flow) => {
    return {
        type: UPDATE_CURRENT_FLOW,
        payload: flow
    }
};

export const updateCurrentAnswerId = (flow) => {
    return {
        type: UPDATE_CURRENT_ANSWER,
        payload: flow
    }
};