import React, { Component } from 'react';
import { Platform, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Button, Text, H2, Toast } from 'native-base';
import { connect } from 'react-redux';
const windowDimensions = Dimensions.get("window");
import FloatingLabel from '../../../components/ui/floatingLabel/floatingLabel';
import { updateUsername, updateMobile, updateEmail, updateOtp } from '../../../store/actions/index';
import { BASE_URL, headers } from '../../../api/config/Config';
import { regularButtonFont } from '../../../components/utility/fonts/FontMaker'
const mapStateToProps = state => ({
    name: state.User.name,
    mobile: state.User.mobile,
    currentFlow: state.Assessment.currentFlow
})
const mapDispatchToProps = dispatch => {
    return {
        updateName: (name) => dispatch(updateUsername(name)),
        updateMobile: (mobile) => dispatch(updateMobile(mobile)),
        updateEmail: (email) => dispatch(updateEmail(email)),
        updateOtp: (mobile) => dispatch(updateOtp(mobile))
    }
}
class GenerateOTP extends Component {
    state = {

        buttonDisable: true,
        mobile: '',
        validUser: ''
    }


    Button_Disable = () => {

        setTimeout(() => {
            if (this.state.mobile != '') {

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


    sendOTP = (props) => {
        //http://172.30.13.35:4000
        //zulapi.herokuapp.com

        fetch(BASE_URL + '/api/findUser', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                mobile: this.state.mobile
            })
        }).then((response) => response.json())
            .then((response) => {

                response.valid !== "true" ?
                    Platform.OS === 'ios' ?
                        Toast.show({
                            text: 'Please enter valid mobile number',
                            duration: 2000,
                            type: 'default',
                            position: 'top'
                        })
                        :
                        Toast.show({
                            text: 'Please enter valid mobile number',
                            duration: 2000,
                            type: 'default'
                        }) : null

                this.setState({
                    validUser: response.valid
                })
            }).then(() => {

                if (this.state.validUser === "true") {
                    this.props.updateMobile(this.state.mobile);
                    this.props.updateOtp(this.state.mobile.substring(4, 8));
                    props.nextHandler();
                }

            })
            .catch((error) => {
                console.error(error);
            });

    }

    render() {
        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    {/* {!this.state.isKeyboardOpen && } */}

                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <FloatingLabel
                            underlineColorAndroid="#fff"
                            labelStyle={styles.labelStyle}
                            inputStyle={styles.inputStyle}
                            keyboardType={"numeric"}
                            maxLength={10}
                            style={styles.customStyle}
                            onChangeText={async (text) => {
                                await this.setState({ mobile: text.replace(/[^0-9]/g, '') });
                                this.Button_Disable();
                            }}
                            accessible={true}
                            accessibilityLabel="Mobile"
                            accessibilityHint="Provide Mobile Number"
                        >Mobile</FloatingLabel>
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={this.state.buttonDisable ? styles.disableBtn : styles.zulBtn} disabled={this.state.buttonDisable} onPress={() => this.sendOTP(this.props)}>
                            <Text style={styles.whiteText}>{"Send OTP".toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GenerateOTP);
const styles = StyleSheet.create({
    container: {

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
        color: '#fff',
        ...regularButtonFont
    },
    blackText: {
        color: '#000',
        ...regularButtonFont
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
        //marginTop: 21,
        //paddingLeft: 9,
        color: '#fff',
        //position: 'absolute'
    },

    inputStyle: {
        height: 60,
        //borderColor: 'gray',
        //backgroundColor: 'transparent',
        //justifyContent: 'center',
        borderWidth: 0,
        color: '#fff',
        ...Platform.select({
            ios: {
                borderBottomColor: '#fff',
                borderBottomWidth: 1,
            }
        }),
        //fontSize: 20,
        //borderRadius: 4,
        //paddingLeft: 10,
        //marginTop: 20,
    },

    customStyle: {
        borderBottomWidth: 0,
        //marginLeft: 20,
        borderColor: '#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    }

});