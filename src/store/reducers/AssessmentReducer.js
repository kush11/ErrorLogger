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

/* DATA VARIABLES FOR ASSESSMENT REDUCER */
const initialState = {
    currentQuestion: {},
    questions: [],
    currentAssessment: "",
    assessmentId: null,
    currentAssessmentDetails: [],
    isNextQuestionLoading: false,
    currentFlow: 'NEW',
    currentAnswerId:null,
    dimensionReport: [{
        title: 'Physical',
        score: '95%',
        icon: require('../../assets/images/dashboard/physical.png'),
        emoji: require('../../assets/images/emoji/01.png'),
        progressColor: '#00b386'
    }, {
        title: 'Emotional',
        score: '75%',
        icon: require('../../assets/images/dashboard/emotional.png'),
        emoji: require('../../assets/images/emoji/02.png'),
        progressColor: '#00b386'
    }, {
        title: 'Spiritual',
        score: '45%',
        icon: require('../../assets/images/dashboard/spiritual.png'),
        emoji: require('../../assets/images/emoji/03.png'),
        progressColor: 'rgb(254, 136, 55)'
    }, {
        title: 'Environmental',
        score: '25%',
        icon: require('../../assets/images/dashboard/environmental.png'),
        emoji: require('../../assets/images/emoji/04.png'),
        progressColor: '#dc3545'
    }, {
        title: 'Financial',
        score: '21%',
        icon: require('../../assets/images/dashboard/financial.png'),
        emoji: require('../../assets/images/emoji/04.png'),
        progressColor: '#dc3545'
    }, {
        title: 'Social',
        score: '54%',
        icon: require('../../assets/images/dashboard/social.png'),
        emoji: require('../../assets/images/emoji/03.png'),
        progressColor: 'rgb(254, 136, 55)'
    }, {
        title: 'Intellectual',
        score: '92%',
        icon: require('../../assets/images/dashboard/intellectual.png'),
        emoji: require('../../assets/images/emoji/01.png'),
        progressColor: '#00b386'
    }, {
        title: 'Occupational',
        score: '89%',
        icon: require('../../assets/images/dashboard/occupational.png'),
        emoji: require('../../assets/images/emoji/01.png'),
        progressColor: '#00b386'
    }],
    assessmentReport: [{
        title: 'Strength & Energy',
        remainingTime: '2 days ago',
        compPercentage: '25%',
    }, {
        title: 'Biological Age',
        remainingTime: '5 days ago',
        compPercentage: '35%'
    }, {
        title: 'Diet Score',
        remainingTime: '65 days ago',
        compPercentage: '65%'
    }, {
        title: 'Relationship & Intimacy',
        remainingTime: '83 days ago',
        compPercentage: '85%'
    }, {
        title: 'Thought Control',
        remainingTime: '73 days ago',
        compPercentage: '21%'
    }, {
        title: 'Wholesomeness',
        remainingTime: '32 days ago',
        compPercentage: '30%'
    }, {
        title: 'Zest For Life',
        remainingTime: '25 days ago',
        compPercentage: '91%'
    }
    ]
}


const AssessmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ASSESSMENT_THEME: {
            state = { ...state, currentAssessment: action.payload }
            break;
        }
        case UPDATE_ASSESSMENT_ID: {
            state = { ...state, assessmentId: action.payload }
            break;
        }
        case EXIT_ASSESSMENT: {
            state = action.payload;
            break;
        }
        case UPDATE_CURRENT_ANSWER: {
             state = { ...state, currentAnswerId: action.payload }
            break;
        }
        case UPDATE_QUESTIONS: {
            state = { ...state, questions: action.payload }
            break;
        }
        case UPDATE_CURRENTQUESTION: {
            state = { ...state, currentQuestion: action.payload }
            break;
        }
        case IS_NEXT_QUESTION_LOADING: {
            state = { ...state, isNextQuestionLoading: action.payload }
            break;
        }
        case UPDATE_CURRENTASSESSMENT: {
            state = { ...state, currentAssessment: action.payload }
            break;
        }
        case UPDATE_ASSESSMENTDETAILS: {
            state = { ...state, currentAssessmentDetails: action.payload }
            break;
        }
        case UPDATE_CURRENT_FLOW: {
            state = { ...state, currentFlow: action.payload }
            break;
        }
    }
    return state;
}

export default AssessmentReducer;