/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Alert, Platform, AsyncStorage } from 'react-native'
import ZingUpLife from './src/components/main/ZingUpLife';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart'
import { BASE_URL, headers } from './src/api/config/Config'
import moment from 'moment'
import { autoLogin } from './src/api/StartPage/AutoLogin'

//Java Script Exception
const errorHandler = (error, isFatal) => {
  let userName = ''
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `        
      We have reported this to our team ! Please close the app and start again!
        `,
      [{
        text: 'Close'
      }, {
        text: 'Restart',
        onPress: () => {
          RNRestart.Restart();
        }
      }]
    );
    AsyncStorage.getItem('userToken').then(token => {
      autoLogin(token).then((responseJson) => {
        try {
          userName = responseJson.name === "JsonWebTokenError" ? 'Unregister' : responseJson.name
          fetch(BASE_URL + '/api/saveerror', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              errorMessage:error.message,
              errorStack: error.stack,
              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
              platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
              user: userName
            })
          }).then((response) => response.json())
        } catch (ex) {
          console.error(ex);
        }
      }).catch((error) => {
        console.log(err)
      });
    })


  } else {
    console.log(error);
  }
};
//Native Exception 
const nativeException = (exceptionString => {
  console.log('exceptionString:',exceptionString)
  Alert.alert(
    'Unexpected error occurred',
    `
      Error: ${exceptionString}

      We have reported this to our team ! Please close the app and start again!
      `,
    [{
      text: 'Close'
    }, {
      text: 'Restart',
      onPress: () => {
        RNRestart.Restart();
      }
    }]
  );
  AsyncStorage.getItem('userToken').then(token => {
    autoLogin(token).then((responseJson) => {
      try {
        userName = responseJson.name === "JsonWebTokenError" ? 'Unregister' : responseJson.name
        fetch(BASE_URL + '/api/saveerror', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            errorMessage:exceptionString,            
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
            user: userName
          })
        }).then((response) => response.json())
      } catch (ex) {
        console.error(ex);
      }
    }).catch((error) => {
      console.log(err)
    });
  })

})
setJSExceptionHandler(errorHandler, true);
setNativeExceptionHandler(nativeException)
export default class App extends Component {
  render() {
    return (
      <ZingUpLife />
    );
  }
}
