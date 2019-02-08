import {
    UPDATE_USERNAME, UPDATE_MOBILE, UPDATE_EMAIL, UPDATE_OTP, UPDATE_PASSCODE,
    UPDATE_GENDER, UPDATE_DOB, UPDATE_GOOGLE_USER_IMAGE, UPDATE_FETCHED_URL,
    UPDATE_HEIGHT, UPDATE_WEIGHT, UPDATE_TEMPHEIGHT, UPDATE_TEMPWEIGHT, UPDATE_BMI,
    UPDATE_INVITECODE, RESET_STATE,UPDATE_TEMPDOB
}
    from '../actions/actionTypes';

const initialState = {
    name: '',
    mobile: '',
    email: '',
    otp: '',
    passcode: '',
    gender: '',
    dob: '',
    socialImage: '',
    fetchedURL: '',
    height: 0,
    weight: 0,
    bmi: '',
    tempheight: 0,
    tempweight: 0,
    tempDob:'',
    inviteCode: ''
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_STATE: {
            state = {
                ...state,
                name: '',
                mobile: '',
                email: '',
                otp: '',
                passcode: '',
                gender: '',
                dob: '',
                socialImage: '',
                fetchedURL: '',
                height: 0,
                weight: 0,
                bmi: '',
                tempheight: 0,
                tempweight: 0,
                tempDob:'',
                inviteCode: ''
            }
            break;
        }
        case UPDATE_TEMPDOB: {
            state = { ...state, tempDob: action.payload }
            break;
        }
        case UPDATE_USERNAME: {
            state = { ...state, name: action.payload }
            break;
        }
        case UPDATE_MOBILE: {
            state = { ...state, mobile: action.payload }
            break;
        }
        case UPDATE_EMAIL: {
            state = { ...state, email: action.payload }
            break;
        }
        case UPDATE_OTP: {
            state = { ...state, otp: action.payload }
            break;
        }
        case UPDATE_PASSCODE: {
            state = { ...state, passcode: action.payload }
            break;
        }
        case UPDATE_GOOGLE_USER_IMAGE: {
            state = {
                ...state,
                socialImage: action.payload
            }
            break;
        }
        case UPDATE_FETCHED_URL: {

            state = {
                ...state,
                fetchedURL: action.payload
            }
            break;
        }
        case UPDATE_DOB: {

            state = {
                ...state,
                dob: action.payload
            }
            break;
        }
        case UPDATE_GENDER: {

            state = {
                ...state,
                gender: action.payload
            }
            break;
        }
        case UPDATE_INVITECODE: {
            state = {
                ...state,
                inviteCode: action.payload
            }
        }
        case UPDATE_HEIGHT: {

            state = {
                ...state,
                height: action.payload
            }
            break;
        }
        case UPDATE_WEIGHT: {

            state = {
                ...state,
                weight: action.payload
            }
            break;
        }
        case UPDATE_TEMPHEIGHT: {

            state = {
                ...state,
                tempheight: action.payload
            }
            break;
        }
        case UPDATE_TEMPWEIGHT: {

            state = {
                ...state,
                tempweight: action.payload
            }
            break;
        }
        case UPDATE_BMI: {

            state = {
                ...state,
                bmi: action.payload
            }
            break;
        }
    }
    return state;
}

export default UserReducer;