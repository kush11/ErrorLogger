import {
    UPDATE_USERNAME, UPDATE_MOBILE, UPDATE_EMAIL, UPDATE_OTP, UPDATE_PASSCODE, UPDATE_GENDER,
    UPDATE_DOB, UPDATE_GOOGLE_USER_IMAGE, UPDATE_FETCHED_URL, UPDATE_HEIGHT, UPDATE_WEIGHT, UPDATE_BMI,
    UPDATE_TEMPHEIGHT, UPDATE_TEMPWEIGHT, UPDATE_INVITECODE,RESET_STATE,UPDATE_TEMPDOB
} from './actionTypes';

import UserGetImageService from '../../api/userImage/UserImageGetService'

export const updateBmi = (bmi) => {
    return {
        type: UPDATE_BMI,
        payload: bmi
    };
};
export const updateTempDob = (tempDob) => {
    return {
        type: UPDATE_TEMPDOB,
        payload: tempDob
    };
};
export const resetState = () => {    
    return {
        type: RESET_STATE,       
    };
};
export const updateHeight = (height) => {
    return {
        type: UPDATE_HEIGHT,
        payload: height
    };
};
export const updateWeight = (weight) => {
    return {
        type: UPDATE_WEIGHT,
        payload: weight
    };
};
export const updateTempHeight = (tempheight) => {
    return {
        type: UPDATE_TEMPHEIGHT,
        payload: tempheight
    };
};
export const updateTempWeight = (tempweight) => {
    return {
        type: UPDATE_TEMPWEIGHT,
        payload: tempweight
    };
};

export const updateGender = (gender) => {
    return {
        type: UPDATE_GENDER,
        payload: gender
    };
};

export const updateInviteCode = (inviteCode) => {
    return {
        type: UPDATE_INVITECODE,
        payload: inviteCode
    };
};

export const updateDob = (dob) => {
    return {
        type: UPDATE_DOB,
        payload: dob
    };
};

export const updateUsername = (name) => {
    return {
        type: UPDATE_USERNAME,
        payload: name
    };
};

export const updateUserSocialImage = (image) => {
    return {
        type: UPDATE_GOOGLE_USER_IMAGE,
        payload: image
    };
};

export const updateFetchedUrl = (url) => {
    return {
        type: UPDATE_FETCHED_URL,
        payload: url
    };
};

export const updateMobile = (mobile) => {
    return {
        type: UPDATE_MOBILE,
        payload: mobile
    };
};

export const updateEmail = (email) => {
    return {
        type: UPDATE_EMAIL,
        payload: email
    };
};

export const updateOtp = (otp) => {
    return {
        type: UPDATE_OTP,
        payload: otp
    };
};

export const updatePasscode = (passcode) => {
    return {
        type: UPDATE_PASSCODE,
        payload: passcode
    };
};