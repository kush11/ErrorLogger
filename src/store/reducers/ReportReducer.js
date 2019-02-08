import { UPDATE_ASSESSMENT_REPORT } from '../actions/actionTypes';



const initialState = {
    assessmentReport: {
        observations: [{
            text: 'Poor appetite',
            type: 'danger'
        }, {
            text: 'Poor posture',
            type: 'danger'
        }, {
            text: 'Poor diet',
            type: 'danger'
        }, {
            text: 'Lack of physical and mental growth',
            type: 'danger'
        }, {
            text: 'Poor sleep',
            type: 'danger'
        }, {
            text: 'Low BMI',
            type: 'danger'
        }, {
            text: 'Lower risk of inheriting diseases',
            type: 'success'
        }, {
            text: 'Good Physical Activity ',
            type: 'success'
        }],
         actionPlan: [
            {
                Goal: 'Balanced diet',
                icon: require('../../assets/images/goals/diet.jpg'),
                description: 'Include some protein, omega-3 fatty acid rich food, grain'
            },
            {
                Goal: 'Sleepathon',
                icon: require('../../assets/images/goals/sleep.jpg'),
                description: 'Self manage your stress level'
            }, {
                Goal: 'Sweat it out',
                icon: require('../../assets/images/goals/sweat.jpg'),
                description: 'Running,Intense workout,Games'
            },
            {
                Goal: 'Improve immunity',
                icon: require('../../assets/images/goals/immunity.jpg'),
                description: 'Snack on fruit,nuts or healthy snacks instead of packaged food'
            }, {
                Goal: 'Improve posture',
                icon: require('../../assets/images/goals/poster.jpg'),
                description: 'Yoga poses- bow pose, cobra pose, garuda pose'
            }
        ],
    }
}


const ReportReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ASSESSMENT_REPORT: {
            state = { ...state, assessmentReport: action.payload }
            break;
        }
    }
    return state;
}

export default ReportReducer;