import React, { Component } from 'react';
import { Platform, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Button, Text, H2, Toast } from 'native-base';
import { connect } from 'react-redux';
const windowDimensions = Dimensions.get("window");
import { BASE_URL, headers } from '../../../api/config/Config';
const mapStateToProps = state => ({
    name: state.User.name,
    mobile: state.User.mobile,
    currentFlow: state.Assessment.currentFlow
})
class ForgotPasscode extends Component {
    state = {
        codeOne: '',
        codeTwo: '',
        codeThree: '',
        codeFour: '',
        codeFive: '',
        codeSix: '',
        codeSeven: '',
        codeEight: '',
        buttonDisable: true,
        mobile: ''
    }

    curFocInput = 1;
    goToNextTextInput = (text, node) => {
        const ob = {};
        ob['code' + node] = text;
        this.setState(ob);
        switch (node) {
            case 'One':
                if (text != '') {
                    this.setState({ codeTwo: '' })
                }
                this.curFocInput = 1;
                break;
            case 'Two':
                if (text != '') {
                    this.setState({ codeThree: '' })
                }
                this.curFocInput = 2;
                break;
            case 'Three':
                if (text != '') {
                    this.setState({ codeFour: '' })
                }
                this.curFocInput = 3;
                break;
            case 'Four':
                this.curFocInput = 4;
                break;
            case 'Five':
                this.curFocInput = 5;
                if (text != '') {
                    this.setState({ codeSix: '' })
                }
                break;
            case 'Six':
                if (text != '') {
                    this.setState({ codeSeven: '' })
                }
                this.curFocInput = 6;
                break;
            case 'Seven':
                if (text != '') {
                    this.setState({ codeEight: '' })
                }
                this.curFocInput = 7;
                break;
            case 'Eight':
                this.curFocInput = 8;
                break;
        }
        if (this.curFocInput > 0 && this.curFocInput != 4 && this.curFocInput < 8 && text != '') {
            this.curFocInput++;
        }
        this.refs[this.curFocInput].focus();
    }

    Button_Disable = () => {
        setTimeout(() => {
            if (this.state.codeOne != '' && this.state.codeTwo != '' && this.state.codeThree != '' && this.state.codeFour != '' && this.state.codeFive != '' && this.state.codeSix != '' && this.state.codeSeven != '' && this.state.codeEight != '') {

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

    submitPasscode = (props) => {
        let passcodeOne = this.state.codeOne + this.state.codeTwo + this.state.codeThree + this.state.codeFour;
        let passcodeTwo = this.state.codeFive + this.state.codeSix + this.state.codeSeven + this.state.codeEight;
        if (passcodeOne === passcodeTwo) {

            fetch(BASE_URL + '/api/passcode', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    mobile: this.props.mobile,
                    passcode: passcodeOne
                })
            }).then((response) => {
                response.json()
                Platform.OS === 'ios' ?
                    Toast.show({
                        text: "Passcode Changed Successfully",
                        duration: 2000,
                        type: 'default',
                        position: 'top'
                    })
                    :
                    Toast.show({
                        text: "Passcode Changed Successfully",
                        duration: 2000,
                        type: 'default'
                    })
                setTimeout(() => {
                    props.goToLogin();
                }, 2000);

            })
                .catch((error) => {
                    Platform.OS === 'ios' ?
                        Toast.show({
                            text: "Passcode has not changed",
                            duration: 2000,
                            type: 'default',
                            position: 'top'
                        })
                        :
                        Toast.show({
                            text: "Passcode has not changed",
                            duration: 2000,
                            type: 'default'
                        })
                    console.error(error);
                });


        }
        else {
            Platform.OS === 'ios' ?
                Toast.show({
                    text: "Passcode not matched",
                    duration: 2000,
                    type: 'default',
                    position: 'top'
                })
                :
                Toast.show({
                    text: "Passcode not matched",
                    duration: 2000,
                    type: 'default'
                })
        }

    }

    render() {
        return (
            <View>
                <Text style={{ marginLeft: 5, marginTop: 10, color: '#ffffff', fontSize: 20 }}>New Passcode:</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'1'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            keyboardType={"numeric"}
                            value={this.state.codeOne}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "One"); this.Button_Disable(); }
                                else { this.setState({ codeOne: '' }) }
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'2'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            keyboardType={"numeric"}
                            value={this.state.codeTwo}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "Two"); this.Button_Disable(); }
                                else { this.setState({ codeTwo: '' }) }
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'3'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            keyboardType={"numeric"}
                            value={this.state.codeThree}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "Three"); this.Button_Disable(); }
                                else { this.setState({ codeThree: '' }) }
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'4'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            keyboardType={"numeric"}
                            value={this.state.codeFour}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "Four"); this.Button_Disable(); }
                                else { this.setState({ codeFour: '' }) }
                            }}
                        />
                    </View>
                </View>
                <Text style={{ marginLeft: 5, color: '#ffffff', marginTop: 10, fontSize: 20 }}>Confirm New Passcode:</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'5'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
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
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
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
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
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
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
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
                <TouchableOpacity style={this.state.buttonDisable ? styles.disableBtn : styles.zulBtn} disabled={this.state.buttonDisable} onPress={() => this.submitPasscode(this.props)}>
                    <Text style={this.state.buttonDisable ? styles.blackText : [styles.whiteText, { fontWeight: 'bold' }]}>{"Change Passcode".toUpperCase()}</Text>
                </TouchableOpacity>
            </View>

        )
    }
}
export default connect(mapStateToProps, null)(ForgotPasscode);
const styles = StyleSheet.create({
    loginLogo: {
        height: 150,
        width: 150
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
    disableBtn: {
        backgroundColor: '#9dffe8',
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
    }

});