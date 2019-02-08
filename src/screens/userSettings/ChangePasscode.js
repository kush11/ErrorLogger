import React, { Component } from 'react';
import { Platform, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Button, Text, H2, Toast } from 'native-base';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BASE_URL, headers } from '../../api/config/Config';
import { savePasscodeInfo } from '../../repository/login/LoginRepository';
const windowDimensions = Dimensions.get("window");
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker'

const mapStateToProps = state => ({
    name: state.User.name,
    mobile: state.User.mobile,
    currentFlow: state.Assessment.currentFlow
})
class Passcode extends Component {
    state = {
        codeOne: '',
        codeTwo: '',
        codeThree: '',
        codeFour: '',
        codeFive: '',
        codeSix: '',
        codeSeven: '',
        codeEight: '',
        codeNine: '',
        codeTen: '',
        codeEleven: '',
        codeTwelve: '',
        buttonDisable: true,
        showSCLAlert: false,
        alertTitle: ""
    }

    curFocInput = 1;
    goToNextTextInput = (text, node) => {
        switch (node) {
            case 'One': this.setState({ codeOne: text })
                if (text != '') {
                    this.setState({ codeTwo: '' })
                }
                this.curFocInput = 1;
                break;
            case 'Two': this.setState({ codeTwo: text })
                if (text != '') {
                    this.setState({ codeThree: '' })
                }
                this.curFocInput = 2;
                break;
            case 'Three': this.setState({ codeThree: text })
                if (text != '') {
                    this.setState({ codeFour: '' })
                }
                this.curFocInput = 3;
                break;
            case 'Four': this.setState({ codeFour: text })
                this.curFocInput = 4;
                break;
            case 'Five': this.setState({ codeFive: text })
                this.curFocInput = 5;
                if (text != '') {
                    this.setState({ codeSix: '' })
                }
                break;
            case 'Six': this.setState({ codeSix: text })
                if (text != '') {
                    this.setState({ codeSeven: '' })
                }
                this.curFocInput = 6;
                break;
            case 'Seven': this.setState({ codeSeven: text })
                if (text != '') {
                    this.setState({ codeEight: '' })
                }
                this.curFocInput = 7;
                break;
            case 'Eight': this.setState({ codeEight: text })
                this.curFocInput = 8;
                break;

            case 'Nine': this.setState({ codeNine: text })
                if (text != '') {
                    this.setState({ codeTen: '' })
                }
                this.curFocInput = 9;
                break;
            case 'Ten': this.setState({ codeTen: text })
                if (text != '') {
                    this.setState({ codeEleven: '' })
                }
                this.curFocInput = 10;
                break;
            case 'Eleven': this.setState({ codeEleven: text })
                if (text != '') {
                    this.setState({ codeTwelve: '' })
                }
                this.curFocInput = 11;
                break;
            case 'Twelve': this.setState({ codeTwelve: text })
                this.curFocInput = 12;
                break;
        }

        if (this.curFocInput > 0 && this.curFocInput != 4 && this.curFocInput != 8 && this.curFocInput < 12 && text != '') {
            this.curFocInput++;
        }
        this.refs[this.curFocInput].focus();

    }

    Button_Disable = () => {
        setTimeout(() => {
            if (this.state.codeTwelve != '' && this.state.codeEleven != '' && this.state.codeTen != '' && this.state.codeNine != '' && this.state.codeFive != '' && this.state.codeSix != '' && this.state.codeSeven != '' && this.state.codeEight != '') {

                this.setState({
                    buttonDisable: false
                })

            }
            else {
                this.setState({
                    buttonDisable: true
                })
            }
        }, 300)
    }
    handleOpen = (title) => {
        this.setState({ showSCLAlert: true, alertTitle: title })
    }

    handleClose = () => {
        this.setState({ showSCLAlert: false, alertTitle: '' });
    }


    submitPasscode = () => {
        let passcodeOne = this.state.codeOne + this.state.codeTwo + this.state.codeThree + this.state.codeFour;
        let passcodeTwo = this.state.codeFive + this.state.codeSix + this.state.codeSeven + this.state.codeEight;
        let passcodeThree = this.state.codeNine + this.state.codeTen + this.state.codeEleven + this.state.codeTwelve;
        if (passcodeThree === passcodeTwo) {
            //172.30.11.228:4000
            //localhost:8080
            fetch(BASE_URL + '/api/changePasscode', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    uName: this.props.name,
                    passcode: passcodeOne,
                    newPasscode: passcodeTwo
                })
            }).then((response) => response.json())
                .then((response) => {
                    Platform.OS === 'ios' ?
                        Toast.show({
                            text: response.message,
                            duration: 2000,
                            type: 'default',
                            position: 'top'
                        })
                        :
                        Toast.show({
                            text: response.message,
                            duration: 2000,
                            type: 'default'
                        })
                    setTimeout(() => {
                        response.valid === "true" ? this.props.navigation.navigate("UserSetting") : null;
                    }, 2000);
                    savePasscodeInfo(passcodeTwo);

                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            this.handleOpen("Oops");
        }

    }

    render() {
        return (
            <ImageBackground resizeMode="cover" style={{ flex: 1, paddingTop:Platform.OS === 'ios' ? 60 : 0, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute', backgroundColor: 'white', padding: 10 }}>
                <SCLAlert
                    theme="danger"
                    show={this.state.showSCLAlert}
                    title={this.state.alertTitle}
                    subtitle="New Passcode and Confirm Passcode not matched!!!"
                    onRequestClose={this.handleClose}
                    titleStyle={{...defaultModalFont}}
                    subtitleStyle={{...defaultModalFont}}
                >
                    <SCLAlertButton theme="danger" onPress={this.handleClose} textStyle={{...regularButtonFont}}
>Close</SCLAlertButton>
                </SCLAlert>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'handled'}
                    keyboardDismissMode={"interactive"}
                    enableOnAndroid={true}
                // style={styles.blackMatLayer}
                >

                    <View>
                        <Text style={{ marginTop: 20, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle }}>Current Passcode</Text>
                        <Text style={{ marginLeft: 5, color: '#bbb', fontSize: 14, ...titleFontStyle }}>(Leave blank if never set previously)</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'1'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeOne}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "One");  }
                                        else { this.setState({ codeOne: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'2'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeTwo}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Two");  }
                                        else { this.setState({ codeTwo: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'3'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeThree}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Three");  }
                                        else { this.setState({ codeThree: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'4'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeFour}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Four");  }
                                        else { this.setState({ codeFour: '' }) }
                                    }}
                                />
                            </View>
                        </View>
                        <Text style={{ marginTop: 10, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle }}>New Passcode</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'5'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeFive}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Five"); this.Button_Disable(); }
                                        else { this.setState({ codeFive: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'6'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeSix}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Six"); this.Button_Disable(); }
                                        else { this.setState({ codeSix: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'7'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeSeven}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Seven"); this.Button_Disable(); }
                                        else { this.setState({ codeSeven: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'8'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeEight}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Eight"); this.Button_Disable(); }
                                        else { this.setState({ codeEight: '' }) }
                                    }}
                                />
                            </View>
                        </View>
                        <Text style={{ marginTop: 10, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle }}>Confirm New Passcode</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'9'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeNine}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Nine"); this.Button_Disable(); }
                                        else { this.setState({ codeNine: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'10'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeTen}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Ten"); this.Button_Disable(); }
                                        else { this.setState({ codeTen: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'11'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeEleven}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Eleven"); this.Button_Disable(); }
                                        else { this.setState({ codeEleven: '' }) }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    ref={'12'}
                                    underlineColorAndroid="#000"
                                    secureTextEntry={true}
                                    placeholderTextColor="#000"
                                    keyboardType={"numeric"}
                                    value={this.state.codeTwelve}
                                    style={styles.input}
                                    maxLength={1}
                                    onChangeText={(text) => {
                                        if (!isNaN(text)) { this.goToNextTextInput(text, "Twelve"); this.Button_Disable(); }
                                        else { this.setState({ codeTwelve: '' }) }
                                    }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={this.state.buttonDisable ? styles.disableBtn : styles.zulBtn} disabled={this.state.buttonDisable} onPress={() => this.submitPasscode()}>
                            <Text style={styles.whiteText}>{"Submit".toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        )
    }
}
export default connect(mapStateToProps, null)(Passcode);
const titleFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
    loginLogo: {
        marginTop: 60,
        marginBottom: 20
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 20,
        marginHorizontal: 5,
        borderRadius: 5,
        textAlign: 'center',
        color: '#000',
        ...Platform.select({
            ios: {
                borderBottomColor: '#000',
                borderBottomWidth: 1,
            }
        }),
    },
    zulBtn: {
        backgroundColor: '#41ab3e',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 30,
        borderRadius: 8,
        marginRight: 80,
        marginLeft: 80
    },
    disableBtn: {
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 30,
        borderRadius: 8,
        marginRight: 80,
        marginLeft: 80
    },
    whiteText: {
        color: '#fff',
        ...regularButtonFont
    },
    blackText: {
        color: '#000'
    },
    blackMatLayer: {
        backgroundColor: 'white',
        position: 'absolute',
        top: 20,
        bottom: 40,
        left: 10,
        right: 10
    }

});