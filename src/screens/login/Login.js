import React, { Component } from 'react';
import { StyleSheet, Keyboard, ImageBackground, Dimensions } from 'react-native';
import Form from './Form';
import { View } from 'native-base';
const windowDimensions = Dimensions.get("window");
import { connect } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';


const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = state => ({
  currentFlow: state.Assessment.currentFlow,
  tempHeight: state.User.tempheight,
  currentAssessment: state.Assessment.currentAssessment,
  image: state.User.socialImage
})
class Login extends Component {
  constructor() {
    super();
    this.state = {
      isKeyboardOpen: false,
      showAlert: false,
      title: '',
      description: '',
      showConfirm: false,
      showProgress: false,
    }
  }
    componentWillMount() {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    componentDidMount() {

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
    showAlert = (title, desc, showConfirm, showProgress) => {
      this.setState({
        showAlert: true,
        title: title,
        description: desc,
        showConfirm: showConfirm,
        showProgress: showProgress
      });
    };

    hideAlert = () => {
      this.setState({
        showAlert: false,
        title: '',
        description: ''
      });
    };

    render() {
      const { showAlert, title, description, showConfirm, showProgress } = this.state;
      return (
        <ImageBackground source={require('../../assets/images/loginwallpapers/loginBackground.jpg')} resizeMode="cover" style={{ flex: 1, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute' }}>
          <View style={styles.blackMatLayer}>
            <Form isKeyboardOpen={this.state.isKeyboardOpen} showAlert={this.showAlert} goHome={this.goHome} goRegister={this.goRegister} goForgotPassword={this.goForgotPassword} goToDashboard={this.goToDashboard} />
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
              this.goHome();

            }}
          />
        </ImageBackground>
      )
    }

    goHome = () => {
      this.props.navigation.navigate("OverviewRoute");
    }
    goRegister = () => {
      this.props.navigation.navigate('Register');
    }
    goForgotPassword = () => {
      this.props.navigation.navigate('ForgotPassword');
    }
    goToDashboard = () => {
      this.props.navigation.navigate('MainApp');
    }

  }

  const styles = StyleSheet.create({
    loginInnerContainer: {
      flex: 1,
      padding: 20
    },
    blackMatLayer: {
      backgroundColor: '#00000054',
      position: 'absolute',
      top: 20,
      bottom: 40,
      left: 10,
      right: 10
    }
  })

  export default connect(mapStateToProps, mapDispatchToProps)(Login);
//export default Login;