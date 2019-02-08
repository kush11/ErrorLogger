import React, { Component } from 'react';
import { AsyncStorage, Platform, View, Image, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Button, Text, H2 } from 'native-base';
import { connect } from 'react-redux';
import { saveLoginInfo } from '../../repository/login/LoginRepository';
import { BASE_URL, headers } from '../../api/config/Config';
import {
    updateUsername, updateDob,updateHeight,updateWeight
} from '../../store/actions/index';
import UserImageStoreService from '../../api/userImage/userImageStoreService'
import { regularButtonFont } from '../../components/utility/fonts/FontMaker'
import moment from 'moment';

const mapStateToProps = state => ({
    name: state.User.name,
    mobile: state.User.mobile,
    email: state.User.email,
    dob: state.User.dob,
    gender: state.User.gender,
    inviteCode: state.User.inviteCode,
    currentFlow: state.Assessment.currentFlow,
    assessmentId: state.Assessment.assessmentId,
    tempHeight: state.User.tempheight,
    tempWeight: state.User.tempweight,
    tempDob:state.User.tempDob,
    image: state.User.socialImage
})
const mapDispatchToProps = dispatch => {
    return {
        updateName: (name) => dispatch(updateUsername(name)),
        updateDob: (dob) => dispatch(updateDob(dob)),
        updateHeight: (height) => dispatch(updateHeight(height)),
        updateWeight: (weight) => dispatch(updateWeight(weight)),
    }
}
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
        buttonDisable: true,
        showAlert: false,
        alertMessage: ''
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
        }
        if (this.curFocInput > 0 && this.curFocInput != 4 && this.curFocInput < 8 && text != '') {
            this.curFocInput++;
        }
        this.refs[this.curFocInput].focus();
    }

    Button_Disable = () => {
        setTimeout(() => {
            if (this.state.codeOne != '' && this.state.codeTwo != '' && this.state.codeThree != '' &&
                this.state.codeFour != '' && this.state.codeFive != '' && this.state.codeSix != '' &&
                this.state.codeSeven != '' && this.state.codeEight != '') {

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

    //map answers to user
    mapAnswerToUser = () => {
        let obj = {
            id: this.props.assessmentId,
            userName: this.props.name,
            dob: this.props.dob ? moment(this.props.dob).format('MM-DD-YYYY') : null
        };
        fetch(BASE_URL + '/api/mapAnswerToUser', {
            method: 'POST',
            headers,
            body: JSON.stringify(obj)
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('User Mapped to Wholesomeness Assessment', responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    submitPasscode = (props) => {
        let passcodeOne = this.state.codeOne + this.state.codeTwo + this.state.codeThree + this.state.codeFour;
        let passcodeTwo = this.state.codeFive + this.state.codeSix + this.state.codeSeven + this.state.codeEight;

        let inviteCode = this.props.inviteCode;
        if (inviteCode !== '') {
            inviteCode = this.props.inviteCode.trim();
        }
        if (passcodeOne === passcodeTwo) {
                        
            fetch(BASE_URL + '/api/user', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: this.props.name,
                    mobile: this.props.mobile,
                    email: this.props.email === '' ? 'demo' + this.props.name : this.props.email,
                    passcode: passcodeOne,
                    //gender: this.props.gender,
                    dob: this.props.tempDob!==''&& this.props.tempDob? moment(this.props.tempDob).format('MM-DD-YYYY'):null,
                    height: this.props.tempHeight,
                    weight: this.props.tempWeight,
                    inviteCode: inviteCode
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    if (responseJson.code === 11000) {
                        this.props.showAlert('Oops!', 'User already registered in ZUL system', 'danger', 'Close')
                    }
                    if (responseJson.status === 'Invalid invite code') {
                        this.props.showAlert('Oops!', 'Enter valid Invite code', 'danger', 'Close')
                    }
                    else {
                        this.props.updateName(responseJson.name);
                        this.props.updateDob(responseJson.dob);
                        this.props.updateHeight(responseJson.height)
                        this.props.updateWeight(responseJson.weight)
                        if (this.props.currentFlow === "UNREGISTERED") {
                            this.mapAnswerToUser();
                        }
                        let userinfo = {};
                        userinfo.reportsNavigation = props.reportsNavigation;
                        userinfo.loginNavigation = props.loginNavigation;
                        userinfo.currentFlow = props.currentFlow;
                        userinfo.passcode = passcodeOne;
                        userinfo.name = this.props.name;
                        userinfo.identityProvider = "ZUL";

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

        } else {
            this.props.showAlert('Oops!', 'Passcode not matched!!!', 'danger', 'Close')

        }

    }

    completeRegisteration = async (userinfo) => {
        //TODO: remove the hotfix for a sustainable solution
        AsyncStorage.setItem('enableTouchId', userinfo.enableTouchId); //hotfix #1164
        saveLoginInfo(userinfo);
        this.props.showAlert('Congratulations!', 'You are now a Zinger!\nYour wellness journey begins.', 'success', 'Let\'s Go');
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={{ marginLeft: 5, color: '#ffffff', fontSize: 20, marginBottom: 10 }}>Passcode:</Text>
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
                <Text style={{ marginLeft: 5, color: '#ffffff', marginTop: 20, fontSize: 20, marginBottom: 10 }}>Re-enter Passcode:</Text>
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
                    <Text style={styles.whiteText}>{"Let's Go".toUpperCase()}</Text>
                </TouchableOpacity>

            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Passcode);
const styles = StyleSheet.create({
    container: {
        marginTop: 60
    },
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
        color: '#fff',
        ...regularButtonFont
    },
    blackText: {
        color: '#000'
    },
    alertContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: "#555555",
        fontWeight: '300'
    }

});
