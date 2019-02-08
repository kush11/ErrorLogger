const initialState = {
    totalReward: 0,
    isCongratulationVisible: false,
    isRewardModalVisible:false
}


const RewardReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RewardReducer_AddReward': {
            state = { ...state, totalReward: state.totalReward + action.payload }
            break;
        }
        case 'RewardReducer_Congratulate': {
            state = { ...state, isCongratulationVisible: action.payload }
            break;
        }

        case 'RewardReducer_RewardModalVisible': {
            state = { ...state, isRewardModalVisible: action.payload }
            break;
        }
    }
    return state;
}

export default RewardReducer;