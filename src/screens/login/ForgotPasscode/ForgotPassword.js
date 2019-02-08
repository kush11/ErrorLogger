import React, { Component } from 'react';
import { Platform, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Button, Text, H2 } from 'native-base';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import WizardTab from '../../../components/ui/WizardTab/WizardTab';
import MobileNos from './GenerateOTP'
import OtpPassword from '../../register/OTP'
import ConfirmPassword from './ConfirmPassword'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { BASE_URL } from '../../../api/config/Config';
const windowDimensions = Dimensions.get("window");
import {defaultModalFont, regularButtonFont} from '../../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
    name: state.User.name,
    mobile: state.User.mobile,
})

class ForgotPasscode extends Component {
    state = {
        currentStep: 0,
        showSCLAlert: false,
        alertTitle: ""
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
    }

    goToLogin = () => {
        this.props.navigation.navigate('LogIn')
    }
    handleOpen = () => {
        this.setState({ showSCLAlert: true })
    }

    handleClose = () => {
        this.setState({ showSCLAlert: false });
    }

    render() {
        return (
            <ImageBackground source={require('../../../assets/images/registration/registerBackground.jpg')} resizeMode="cover" style={{ flex: 1, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute' }}>
                <SCLAlert
                    theme="danger"
                    show={this.state.showSCLAlert}
                    title={'Oops!'}
                    subtitle="Please enter valid OTP."
                    cancellable={true}
                    onRequestClose={this.handleClose}
                    headerContainerStyles={{ backgroundColor: '#41ab3e' }}
                    titleStyle={{...defaultModalFont}}
                    subtitleStyle={{...defaultModalFont}}
                >
                    <SCLAlertButton theme="danger" onPress={this.handleClose} textStyle={{...regularButtonFont}}>Close</SCLAlertButton>
                </SCLAlert>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'handled'}
                    keyboardDismissMode={"interactive"}
                    enableOnAndroid={true}
                    style={styles.blackMatLayer}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={styles.loginLogo} source={require('../../../assets/images/onboard/zulNew.png')} />
                        <Text style={{ fontSize: 25, color: '#fff', textAlign: 'center' }}>Forgot Passcode</Text>
                    </View>

                    <WizardTab currentStepSelected={this.state.currentStep}>
                        <MobileNos title="Enter Mobile Number" nextHandler={this.goToNext} prevHandler={this.goToPrevious} />
                        <OtpPassword title="OTP for Password" showAlert={this.handleOpen} nextHandler={this.goToNext} prevHandler={this.goToPrevious} />
                        <ConfirmPassword title="Confirm Password" nextHandler={this.goToNext} prevHandler={this.goToPrevious} goToLogin={this.goToLogin} />
                    </WizardTab>


                </KeyboardAwareScrollView>
            </ImageBackground>
        )
    }
}
export default connect(mapStateToProps, null)(ForgotPasscode);
const styles = StyleSheet.create({
    container: {

    },
    loginLogo: {
        marginTop: 40,
        marginBottom: 20
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 20,
        marginHorizontal: 5,
        borderRadius: 5,
        textAlign: 'center',
        color: '#fff',
        ...Platform.select({
            ios: {
                borderBottomColor: '#fff',
                borderBottomWidth: 1,
            }
        }),
    },
    zulBtn: {
        backgroundColor: '#41ab3e',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 20,
        borderRadius: 8,
        marginRight: 60,
        marginLeft: 60
    },
    otpBtn: {
        backgroundColor: '#00c497',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 20,
        borderRadius: 8,
        marginRight: 100,
        marginLeft: 100
    },
    disableBtn: {
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 20,
        borderRadius: 8,
        marginRight: 60,
        marginLeft: 60
    },
    whiteText: {
        color: '#fff'
    },
    blackText: {
        color: '#000'
    },
    blackMatLayer: {
        backgroundColor: '#00000054',
        position: 'absolute',
        top: 20,
        bottom: 40,
        left: 10,
        right: 10
    },
    labelStyle: {
        color: '#fff',
    },

    inputStyle: {
        height: 60,
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
        borderBottomRightRadius: 10
    }

});
