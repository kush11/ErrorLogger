import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Keyboard, ImageBackground, ScrollView } from 'react-native';
import { Text, Button } from 'native-base';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import UserDetails from './UserDetails';
import OTP from './OTP';
import Passcode from './Passcode';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeAlert from 'react-native-awesome-alerts';
import WizardTab from '../../components/ui/WizardTab/WizardTab';
const windowDimensions = Dimensions.get("window");
import { connect } from 'react-redux';
import { updateUsername, updateUserSocialImage } from '../../store/actions/index'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';


const mapDispatchToProps = dispatch => ({
  updateUserName: (name) => dispatch(updateUsername(name)),
  updateUserSocialImage: (image) => dispatch(updateUserSocialImage(image)),

})

const mapStateToProps = state => ({
  currentFlow: state.Assessment.currentFlow,
  tempHeight: state.User.tempheight,
  currentAssessment: state.Assessment.currentAssessment,
  image: state.User.socialImage
})
class Register extends Component {
  constructor() {
    super();
    this.state = {
      showSCLAlert: false,
      showAlert: false,
      title: 'Oops!',
      description: 'Welcome',
      theme:'success',
      buttonMessage:'Let\'s go',
      showConfirm: false,
      showProgress: false,
      isKeyboardOpen: false,
      currentStep: 0
    };

  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentDidMount() {

  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {
    this.setState({
      isKeyboardOpen: true
    })
  }

  _keyboardDidHide = () => {
    this.setState({
      isKeyboardOpen: false
    })
  }


  handleOpen = () => {
    this.setState({ showSCLAlert: true })
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
    if(this.state.theme==='success')
      this.props.currentFlow === "UNREGISTERED" ? this.reportsNavigation() : this.props.image !== '' ? this.Dashboard() : this.loginNavigation();
  }


  showAlert = (title, desc, showConfirm, showProgress) => {
    this.setState({
      showAlert: true,
      title: title,
      description: desc,
      showConfirm: showConfirm,
      showProgress: showProgress
    });
  };

  showSCLAlert = (title, desc,theme,buttonMessage) => {
    this.setState({
      showSCLAlert: true,
      title:title,
      description:desc,
      theme:theme,
      buttonMessage:buttonMessage,      
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      description: ''
    });
  };
  goLandingPage = () => {
    this.props.navigation.navigate('StartPage');
  }
  Dashboard = () => {
    this.props.navigation.navigate("OverviewRoute");
  }
  loginNavigation = () => {
    this.props.navigation.navigate('LogIn');
  }
  reportsNavigation = () => {
    if (this.props.currentAssessment === 'Biological Age')
      this.props.navigation.navigate('BiologicalReport');
    else
      this.props.navigation.navigate('AssessmentReport');
  }
  goToNext = () => {
    this.setState(prevState => {
      return {
        currentStep: prevState.currentStep + 1
      };
    });
  };

  goToPrevious = () => {
    this.setState(prevState => {
      return {
        currentStep: prevState.currentStep - 1
      };
    });
  };

  render() {
    const { showAlert, title, description, showConfirm, showProgress } = this.state;
    return (
      <ImageBackground source={require('../../assets/images/registration/registerBackground.jpg')} resizeMode="cover" style={{ flex: 1, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute' }}>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={"interactive"}
          enableOnAndroid={true}
          style={styles.blackMatLayer}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image style={styles.loginLogo} source={require('../../assets/images/onboard/zulNew.png')} />
            <Text style={{ fontSize: 25, color: '#fff', textAlign: 'center' }}>Create an account</Text>
          </View>

          <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 0.5 }}>
            <WizardTab currentStepSelected={this.state.currentStep}>
              <UserDetails title="Zinger Details" showAlert={this.showSCLAlert} nextHandler={this.goToNext} prevHandler={this.goToPrevious} goToDashboard={this.Dashboard} />
              <OTP title="Enter OTP" showAlert={this.showSCLAlert} nextHandler={this.goToNext} prevHandler={this.goToPrevious} />
              <Passcode title="Set Passcode" showAlert={this.showSCLAlert} nextHandler={this.goToNext} prevHandler={this.goToPrevious} goToDashboard={this.Dashboard} loginNavigation={this.loginNavigation} reportsNavigation={this.reportsNavigation} />
            </WizardTab>
          </View>

          <AwesomeAlert
            alertContainerStyle={{ width: "100%", height: 600 }}
            messageStyle={{ fontSize: 15, color: '#3a3a3a' }}
            confirmButtonTextStyle={{ fontSize: 16, paddingVertical: 5, textAlign: 'center' }}
            confirmButtonStyle={{ width: 200 }}
            show={showAlert}
            showProgress={showProgress}
            title={title}
            message={description}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={showConfirm}
            cancelText=""
            confirmText="Continue"
            confirmButtonColor="#00c497"
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
              this.props.currentFlow === "UNREGISTERED" ? this.reportsNavigation() : this.props.image !== '' ? this.Dashboard() : this.loginNavigation();
            }}
          />

        </KeyboardAwareScrollView >
        <SCLAlert
          theme={this.state.theme}
          show={this.state.showSCLAlert}
          title={this.state.title}
          subtitle={this.state.description}
          cancellable={true}
          onRequestClose={this.handleClose}
          titleStyle={{...defaultModalFont}}
          subtitleStyle={{...defaultModalFont}}
        >
        {this.state.title==='Congratulations!'?(
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Image source={require('../../assets/images/registration/wellnessimg.jpg')} style={{height: 90, width:"80%", marginBottom:10}}/>
          </View>
        ):null}
          <SCLAlertButton theme={this.state.theme} onPress={this.handleClose} textStyle={{...regularButtonFont}}>{this.state.buttonMessage}</SCLAlertButton>
        </SCLAlert>
      </ImageBackground >
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loginLogo: {
    marginTop: 10,
    marginBottom: 10
  },
  wizardStep: {
    flex: 1,
    padding: 5
  },
  wizardInternal: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10
  },
  selectedWizardStep: {
    flex: 1,
    padding: 5
  },
  selectedWizardInternal: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#00c497',
    paddingVertical: 5,
    borderRadius: 10
  },
  blackMatLayer: {
    backgroundColor: '#00000054',
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
