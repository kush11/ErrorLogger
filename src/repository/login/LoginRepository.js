import React, { Component } from 'react';
import { AsyncStorage, Alert } from 'react-native';
// Repo implementation to store data in device
// TODO: To move login repo with Repository pattern
//@author: meshakti

export default class LoginRepo {

}
export const saveLoginInfo = async (userInfo) => {
    try {
        AsyncStorage.removeItem('name');
        await AsyncStorage.setItem('name', userInfo.name);

        AsyncStorage.removeItem('passcode');
        await AsyncStorage.setItem('passcode', userInfo.passcode);

        AsyncStorage.removeItem('enableTouchId');
        await AsyncStorage.setItem('enableTouchId', userInfo.enableTouchId);
        
        AsyncStorage.removeItem('identityProvider');
        await AsyncStorage.setItem('identityProvider', userInfo.identityProvider);

        return true;
    }
    catch (ex) {
        return false;
    }
}

export const isTouchIdEnabled = async () => {
    let isTouchId = await AsyncStorage.getItem('enableTouchId');
    return isTouchId ? isTouchId === 'true' : false;

}

export const getLoggedInUserName = async () => {
    let name = await AsyncStorage.getItem('name');
    return name;

}
export const getLoggedInPassCode = async () => {
    let passcode = await AsyncStorage.getItem('passcode');
    return passcode;

}
export const getIdentityProvider = async () => {
    let identityProvider = await AsyncStorage.getItem('identityProvider');
    return identityProvider;

}
export const saveTouchIdInfo = async (userInfo) => {
    await AsyncStorage.removeItem('enableTouchId');
    await AsyncStorage.setItem('enableTouchId', userInfo.enableTouchId);

}
export const savePasscodeInfo = async (passcode) => {
    await AsyncStorage.removeItem('passcode');
    await AsyncStorage.setItem('passcode', passcode);

}

export const saveIdentityProviderInfo = async (identityProvider) => {
    await AsyncStorage.removeItem('identityProvider');
    await AsyncStorage.setItem('identityProvider', identityProvider);

}