import React, { Component } from 'react';
import { Alert, Platform, TextInput, View, StyleSheet, TouchableOpacity, Text, Image, AsyncStorage } from 'react-native';
import TouchComponent from '../../components/ui/biometric/TouchId';
import FloatingLabel from '../../components/ui/floatingLabel/floatingLabel';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  updateUsername, updateMobile, updateEmail, updateOtp, updateGender,
  updateDob, updateUserSocialImage, updateHeight, updateWeight
} from '../../store/actions/index';
import { updateCurrentFlow } from '../../store/actions/assessment';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { BASE_URL, headers } from '../../api/config/Config';
import { Toast } from 'native-base';
import FBSDK, {
  LoginManager, AccessToken, LoginButton, GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';
import GetFacebookInfoService from '../../api/fblogin/fbLoginService';
import Divider from '../../components/ui/Divider/Divider';
import { enableTouchId, saveLoginInfo, getIdentityProvider, isTouchIdEnabled, getLoggedInUserName, getLoggedInPassCode, saveIdentityProviderInfo } from '../../repository/login/LoginRepository';
import UserImageStoreService from '../../api/userImage/userImageStoreService';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  passcode: state.User.passcode,
  uName: state.User.name,
  uEmail: state.User.email,
  uSocialImage: state.User.socialImage,
})
const mapDispatchToProps = dispatch => ({
  updateUsername: (name) => dispatch(updateUsername(name)),
  updateMobile: (mobile) => dispatch(updateMobile(mobile)),
  updateOtp: (mobile) => dispatch(updateOtp(mobile)),
  updateGender: (gender) => dispatch(updateGender(gender)),
  updateCurrentFlow: (flow) => dispatch(updateCurrentFlow(flow)),
  updateUserSocialImage: (image) => dispatch(updateUserSocialImage(image)),
  updateDob: (dob) => dispatch(updateDob(dob)),
  updateInviteCode: (inviteCode) => dispatch(updateInviteCode(inviteCode)),
  updateEmail: (email) => dispatch(updateEmail(email))
})

class Form extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      passcode: "",
      isTouchIdEnabled: false,
      showAlert: false,
      showSCLAlert: false,
      alertMessage: '',
    }
  }

  componentDidMount() {
    isTouchIdEnabled().then((value) => {
      this.setState({ isTouchIdEnabled: value });
    });
    GoogleSignin.configure()
    let isSignedIn = GoogleSignin.isSignedIn()
    if (isSignedIn) {
      GoogleSignin.signOut();
    }
    if (AccessToken.getCurrentAccessToken()) {
      LoginManager.logOut()
    }
  }
  componentWillUnmount() {

  }

  showAlertMessage = (message) => {
    this.setState((prevState, currentProps) => {
      return {
        alertMessage: message,
        showAlert: !prevState.showAlert
      };
    });
  }
  toggleAlert = () => {
    this.setState((prevState, currentProps) => {
      return {
        showAlert: !prevState.showAlert
      };
    });
  }
  handleClose = () => {
    this.setState((prevState, currentProps) => {
      return {
        showAlert: !prevState.showAlert
      };
    });
  }
  handleSuccessClose = () =>{
    this.setState({ showSCLAlert: false });
    this.props.goHome();

  }
  render() {
    debugger;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        keyboardDismissMode={"interactive"}
        enableOnAndroid={true}
        style={styles.container}
      >
        <SCLAlert
          theme="danger"
          show={this.state.showAlert}
          title="Oops!"
          subtitle={this.state.alertMessage}
          cancellable={true}
          onRequestClose={this.toggleAlert}
          titleStyle={{...defaultModalFont}}
          subtitleStyle={{...defaultModalFont}}
        >
          <SCLAlertButton theme="danger" onPress={this.toggleAlert} textStyle={{...regularButtonFont}}
>Close</SCLAlertButton>
        </SCLAlert>

             <SCLAlert
          theme={"success"}
          show={this.state.showSCLAlert}
          title={"Congratulations!"}
          subtitle={"You are now a Zinger!\nYour wellness journey begins."}
          cancellable={true}
          onRequestClose={this.handleSuccessClose}
          titleStyle={{...defaultModalFont}}
          subtitleStyle={{...defaultModalFont}}
        >
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Image source={require('../../assets/images/registration/wellnessimg.jpg')} style={{height: 90, width:"80%", marginBottom:10}}/>
          </View>
          <SCLAlertButton theme={"success"} onPress={this.handleSuccessClose} textStyle={{...regularButtonFont}}>{"Let\'s Go"}</SCLAlertButton>
        </SCLAlert>

        <View style={styles.loginActionView}>
          <Image style={styles.loginLogo} source={require('../../assets/images/onboard/zulNew.png')} />
          {/* <Text style={styles.loginText}>Login To Account</Text> */}
        </View>
        <View style={styles.loginInput}>

          <FloatingLabel
            underlineColorAndroid="#fff"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            onChangeText={(text) => this.setState({ name: text })}
            accessible={true}
            accessibilityLabel="Username"
            accessibilityHint="Provide Username">
            Username</FloatingLabel>
          <FloatingLabel
            underlineColorAndroid="#fff"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            secureTextEntry={true}
            keyboardType={"numeric"}
            value={this.state.passcode}
            style={styles.customStyle}
            maxLength={4}
            onChangeText={async (text) => { await this.setState({ passcode: text.replace(/[^0-9]/g, '').slice(0, 4) }) }}
            accessible={true}
            accessibilityLabel="Passcode"
            accessibilityHint="Provide Passcode">
            Passcode</FloatingLabel>
          {this.state.isTouchIdEnabled ?
            <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
              <View style={{ flex: 3 }}>
                <TouchableOpacity style={styles.logInBtnwithTouchId} onPress={this.loginUser}>
                  <Text style={styles.whiteText}>{'Login'.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.touchID}>
                <TouchComponent goHome={this.touchId} askByDefault={this.state.isTouchIdEnabled}
                  accessible={true}
                  accessibilityLabel="Touch Id Authentication"
                  accessibilityHint="Access application by Touch Id" />
              </View>
            </View>
            :
            <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
              <View style={{ flex: 3 }}>
                <TouchableOpacity style={styles.logInBtn} onPress={this.loginUser}>
                  <Text style={styles.whiteText}>{'Login'.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
            <View style={styles.flexRow}>
            <View style={styles.flexOne}>

              <TouchableOpacity style={styles.forgotBtn} onPress={this.props.goForgotPassword}>
                <Text style={[styles.whiteText, styles.underlineStyle]}>Forgot passcode?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupStyle}>
              <TouchableOpacity style={styles.registerBtn} onPress={this.props.goRegister}>
                <Text style={[styles.whiteText, styles.underlineStyle]}>New Here? Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginLeft: 30, marginRight: 30, marginTop: 20 }}>
            <Divider  fontSize='20' fontWeight="bold" borderColor="#cbd9ba" color="#fff" orientation="center" borderStyle="dashed" >
              OR
</Divider>
          </View>

          <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
            <View style={{ flex: 3 }}>
              <TouchableOpacity style={styles.googleBtn} onPress={this.signIn.bind(this)}>
                <Text style={styles.whiteText}>{'Login with google'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
            <View style={{ flex: 3 }}>
              <TouchableOpacity style={styles.facebookBtn} onPress={this.fbSignIN.bind(this)}>
                <Text style={styles.whiteText}>{'Login with facebook'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>

       

          {/* {this.state.isTouchIdEnabled && <View style={styles.biometricStyle}>
<View style={styles.touchIdStyle}>
<TouchableOpacity
accessible={true}
accessibilityLabel="Fcae Id Authentication"
accessibilityHint="Access application by Face Recognition">
<Image style={styles.imgStyle} source={require('../../assets/images/loginwallpapers/faceIdWhite.png')} />
</TouchableOpacity>
</View>
            <TouchComponent goHome={this.touchId} askByDefault={this.state.isTouchIdEnabled}
              accessible={true}
              accessibilityLabel="Touch Id Authentication"
              accessibilityHint="Access application by Touch Id" />
          </View>} */}

        </View>
      </KeyboardAwareScrollView>
    );
  }

  // login user 

  initUser = async () => {
    await AccessToken.getCurrentAccessToken().then((data) => {
      const { accessToken } = data
      GetFacebookInfoService.fetchFacebookInfo(accessToken)
        .then(async (json) => {
          console.log(json)
          await (
            this.props.updateUsername(json.email.split('@')[0].trim()),
            this.props.updateUserSocialImage(json.picture.data.url),
            this.props.updateEmail(json.email),
            AsyncStorage.setItem("UserSocialImage", json.picture.data.url)
          )
          saveIdentityProviderInfo("FB");
          this.checkUserByEmail('FB')
        })
        .catch(() => {
          reject('ERROR GETTING DATA FROM FACEBOOK')
          Toast.show({
            text: "Sign In Cancelled by User",
            duration: 2000,
            type: 'default'
          });
        })
    })
  }

  fbSignIN = async () => {
    await LoginManager.logInWithReadPermissions(["email", 'public_profile']).then(function (result) {
      if (result.isCancelled) {
        Toast.show({
          text: "Sign In Cancelled by User",
          duration: 2000,
          type: 'default'
        });
      }
      else {
        console.log('Login Successful', result);
      }
    }, function (error) {
      console.log('An error occured' + error)
    })
    await this.initUser()
  }

  canLoginUser = () => {
    let canLogin = false;
    if (this.state.name && this.state.passcode === "") {
      this.showAlertMessage("Please enter passcode");
    }
    else if (this.state.passcode && this.state.name === "") {
      this.showAlertMessage("Please enter username");
    }
    else if (this.state.name === "" && this.state.passcode === "") {
      this.showAlertMessage("Please enter username & passcode");
    }
    else {
      canLogin = true;
    }
    return canLogin;
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo)
      await (
        this.props.updateUsername(userInfo.user.email.split('@')[0].trim()),
        this.props.updateUserSocialImage(userInfo.user.photo),
        this.props.updateEmail(userInfo.user.email)
      )
      AsyncStorage.setItem("UserSocialImage", userInfo.user.photo);
      this.checkUserByEmail('Google');
      saveIdentityProviderInfo("Google");
    }
    catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          text: "Sign In Cancelled by User",
          duration: 2000,
          type: 'default'
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          text: "operation (f.e. sign in) is in progress already",
          duration: 2000,
          type: 'default'
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          text: "Play services not available or outdated",
          duration: 2000,
          type: 'default'
        });
      } else {
        Toast.show({
          text: "Some other error happened",
          duration: 2000,
          type: 'default'
        });
      }
      await AsyncStorage.removeItem("UserSocialImage");
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }

    }
  };
  checkUserByEmail = (medium) => {
    fetch(BASE_URL + '/api/getemail', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: this.props.uEmail,

      })
    }).then((response) => response.json())
      .then(async (responseJson) => {
        console.log("check", responseJson)
        if (responseJson) {
          console.log(responseJson)
          let token = responseJson.token
          if (token)
            await AsyncStorage.setItem('userToken', token);
          if (responseJson.result.email === this.props.uEmail) {
            await (

              this.props.updateUsername(responseJson.result.name),
              this.props.updateDob(responseJson.result.dob),
              this.props.updateCurrentFlow("REGISTERED")
            )
            this.props.goHome();
          }
          else {
            this.registerSocialUser(medium);
          }
        }
      })
      .catch(async () => {
        console.log("catch")
        this.registerSocialUser(medium)
      });
  }
  //Touch id
  registerSocialUser = (medium) => {
    fetch(BASE_URL + '/api/registrationValidation', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: this.props.uEmail.split('@')[0].trim(),
        inviteCode: ""
      })
    }).then((response) => response.json())
      .then(async (responseJson) => {
        console.log("regsocuser", responseJson)
        if (responseJson.hasOwnProperty('status')) {
          await (
            this.props.updateUsername(this.props.uName),
            this.props.updateMobile(''),
            this.props.updateEmail(this.props.uEmail),
            this.props.updateOtp(''),
            this.props.updateGender(''),
            this.props.updateDob('')
          )
          await this.submitPasscode(medium)
        }
        else if (responseJson.hasOwnProperty('err')) {
          console.log("regsocusererror else")
          Toast.show({
            text: responseJson.err,
            duration: 2000,
            type: 'default'
          });

        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  submitPasscode = (medium) => {
    console.log("aaya")
    fetch(BASE_URL + '/api/user', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: this.props.uEmail.split('@')[0].trim(),
        email: this.props.uEmail,
        passcode: '',
        gender: '',
        dob: '',
        height: 0,
        weight: 0,
        inviteCode: ''
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.code === 11000) {
          this.showAlertMessage("User already registered in ZUL system")
        }
        else if (responseJson.status === 'Invalid invite code') {
          this.showAlertMessage("Enter valid Invite code")
        }
        else {
          let userinfo = {};
          userinfo.name = this.props.uName;
          userinfo.passcode = '';
          userinfo.identityProvider = medium;
          Alert.alert(
            'Enable Touch Id',
            'Do you want to enable touch id?',
            [
              {
                text: 'NO', onPress: () => {
                  userinfo.enableTouchId = "false";
                  this.completeRegisteration(userinfo);

                }
                , style: 'cancel'
              },
              {
                text: 'YES', onPress: () => {
                  userinfo.enableTouchId = "true";
                  this.completeRegisteration(userinfo);

                }
              },
            ],
            { cancelable: false }
          )
        }
      })

  }

  completeRegisteration = async (userinfo) => {
    //TODO: remove the hotfix for a sustainable solution
    const profileImage = {
      image: { imageUrl: this.props.uSocialImage },
      user: this.props.uName
    }
    this.props.updateCurrentFlow("REGISTERED");
    AsyncStorage.setItem('enableTouchId', userinfo.enableTouchId); //hotfix #1164
    saveLoginInfo(userinfo);

    (this.props.uSocialImage === '' || !this.props.uSocialImage) ? null : await UserImageStoreService.fetchUserStoreData(profileImage)
    this.setState({
      showSCLAlert:true
    });
  }
  touchId = () => {

    getLoggedInUserName().then((userName) => {
      this.setState({ name: userName })
    });
    getLoggedInPassCode().then((passcode) => {
      this.setState({ passcode: passcode })
    });
    getIdentityProvider().then((provider) => {
      switch (provider) {
        case "Google":
          this.signIn();
          break;
        case "FB":
          this.fbSignIN();
          break;
        default:
          setTimeout(() => {
            fetch(BASE_URL + '/api/getpasscode', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                name: this.state.name,
                passcode: this.state.passcode
              })
            }).then((response) => response.json())
              .then((responseJson) => {
                if (responseJson) {

                  let token = responseJson.token;
                  AsyncStorage.setItem('userToken', token);
                  this.props.updateUsername(this.state.name);
                  this.props.updateDob(responseJson.result.dob);
                  this.props.updateUserSocialImage('');
                  this.props.updateCurrentFlow("REGISTERED");

                  this.props.goHome();
                }
              })
              .catch((error) => {
                this.showAlertMessage("Touch Id error. Please login with your credentials");
              });
          }, 200);
          break;
      }

    })


  }
  // login user 
  loginUser = () => {
    if (this.canLoginUser()) {
      fetch(BASE_URL + '/api/getpasscode', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: this.state.name,
          passcode: this.state.passcode
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson) {
            if (responseJson.status === "verify") {
              let token = responseJson.token;
              AsyncStorage.setItem('userToken', token);
              this.props.updateUsername(this.state.name);
              this.props.updateDob(responseJson.result.dob);
              this.props.updateUserSocialImage('');
              this.props.updateCurrentFlow("REGISTERED");
              let userinfo = {
                "name": this.state.name,
                "passcode": this.state.passcode,
                "enableTouchId": "false",
                "identityProvider": "ZUL"
              }
              saveLoginInfo(userinfo);
              this.props.goHome();
            }
            else if (responseJson.status == "401") {
              this.showAlertMessage("username/passcode do not match")
            } else if (responseJson.status !== "verify") {
              this.showAlertMessage("username/passcode do not match")
            }
          }
        })
        .catch((error) => {
          this.showAlertMessage("Please enter a valid Username");
        });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);

const styles = StyleSheet.create({
  touchIdStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  biometricStyle: {
    flexDirection: 'row',
    marginTop: 10
  },
  signupStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  underlineStyle: {
    textDecorationLine: 'underline'
  },
  flexOne: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  inputBorder: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  loginInput: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center'
  },
  loginText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center'
  },
  loginActionView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgStyle: {
    width: 50,
    height: 45
  },
  container: {
    flex: 0.75,
    flexDirection: 'column'
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 20,
    color: '#fff'
  },
  loginLogo: {
    marginTop: 40,
    marginBottom: 20
  },
  touchID:
  {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1,
    borderColor: '#41ab3e',
    borderWidth: 2,
    alignSelf: 'center',
    height: 60,
    top: 10,
    borderRadius: 8
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  logInBtnwithTouchId: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  googleBtn: {
    backgroundColor: '#db4a40',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  facebookBtn: {
    backgroundColor: '#49659c',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8
  },
  forgotBtn: {
    padding: 5,
    margin: 10
  },
  whiteText: {
    color: '#ffffff',
    fontSize: 15,
    ...regularButtonFont,
  },
  registerBtn: {
    padding: 5,
    margin: 10
  },

  labelStyle: {
    color: '#fff',
  },

  inputStyle: {
    height: 50,
    borderWidth: 0,
    color: '#fff',
    ...Platform.select({
      ios: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
      }
    }),
  },

  customStyle: {
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: 20,
    marginRight: 20
  }
});

