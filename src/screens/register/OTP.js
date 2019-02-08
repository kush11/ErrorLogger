import React, { Component } from 'react';
import { Platform, View, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button, Text, H2 } from 'native-base';
import { connect } from 'react-redux';
import { BASE_URL, headers } from '../../api/config/Config';
import { regularButtonFont } from '../../components/utility/fonts/FontMaker'
import Icon from 'react-native-vector-icons/FontAwesome'
const mapStateToProps = state => ({
    // reqOTP: state.User.otp,
    name: state.User.name,
    mobile: state.User.mobile
})
class OTP extends Component {
    state = {
        digitOne: '',
        digitTwo: '',
        digitThree: '',
        digitFour: '',
        buttonDisable: true,
        displaySendOTP: false,
        reqOTP: ''
    };

    componentDidMount() {
        this.sendOTP();
        setTimeout(() => {
            this.setState({
                displaySendOTP: true
            })
        }, 10000);
    }

    sendOTP = () => {
        fetch(BASE_URL + '/api/otp', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                mobile: this.props.mobile
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({
                    reqOTP: responseJson.resOtp
                })
            })
    }

    curFocInput = 1;
    goToNextTextInput = (text, node) => {

        switch (node) {
            case 'One': this.setState({ digitOne: text })
                this.curFocInput = 1;
                if (text != '') {
                    this.setState({ digitTwo: '' })
                }

                break;
            case 'Two': this.setState({ digitTwo: text })
                this.curFocInput = 2;
                if (text != '') {
                    this.setState({ digitThree: '' })
                }
                break;
            case 'Three': this.setState({ digitThree: text })
                this.curFocInput = 3;
                if (text != '') {
                    this.setState({ digitFour: '' })
                }
                break;
            case 'Four': this.setState({ digitFour: text })
                this.curFocInput = 4;

                break;
        }


        if (this.curFocInput > 0 && this.curFocInput < 4 && text != '') {
            this.curFocInput++;
        }

        this.refs[this.curFocInput].focus();

    }

    Button_Disable = () => {
        setTimeout(() => {
            if (this.state.digitOne != '' && this.state.digitTwo != '' && this.state.digitThree != '' && this.state.digitFour != '') {

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


    submitOTP = (props) => {
        let inputOTP = this.state.digitOne + this.state.digitTwo + this.state.digitThree + this.state.digitFour;
        if (this.state.reqOTP === inputOTP) {
            props.nextHandler();
        }
        else {
            this.props.showAlert('Oops!', 'Please enter valid OTP', 'danger', 'Close')
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={{ marginLeft: 5, color: '#ffffff', fontSize: 20, marginBottom: 10 }}>One time password(OTP)</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'1'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            value={this.state.digitOne}
                            keyboardType={"numeric"}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "One"); this.Button_Disable(); }
                                else { this.setState({ digitOne: '' }) }
                            }}

                        />

                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'2'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            value={this.state.digitTwo}
                            keyboardType={"numeric"}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "Two"); this.Button_Disable(); }
                                else { this.setState({ digitTwo: '' }) }
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'3'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            value={this.state.digitThree}
                            keyboardType={"numeric"}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "Three"); this.Button_Disable(); }
                                else { this.setState({ digitThree: '' }) }
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={'4'}
                            underlineColorAndroid="#fff"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            value={this.state.digitFour}
                            keyboardType={"numeric"}
                            style={styles.input}
                            maxLength={1}
                            onChangeText={(text) => {
                                if (!isNaN(text)) { this.goToNextTextInput(text, "Four"); this.Button_Disable(); }
                                else { this.setState({ digitFour: '' }) }
                            }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.sendOTP()}>
                    {this.state.displaySendOTP ?
                        <View style={{ flexDirection: 'row',alignSelf:'center',marginTop:20 }}>
                            <Icon name="repeat" style={{ fontSize:13,color:'#ffffff',marginVertical:19,...regularButtonFont}} size={10} />
                            <Text style={{ marginLeft: 3, marginVertical: 10, padding: 5, textAlign: 'center', color: '#ffffff', ...regularButtonFont, flexDirection: 'column' }}>Resend OTP</Text>
                        </View> : null}
                </TouchableOpacity>
                <TouchableOpacity style={this.state.buttonDisable ? styles.disableBtn : styles.zulBtn} disabled={this.state.buttonDisable} onPress={() => this.submitOTP(this.props)}>
                    <Text style={styles.whiteText}>{'Submit OTP'.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
export default connect(mapStateToProps, null)(OTP);
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
        marginTop: 40,
        borderRadius: 8,
        marginRight: 60,
        marginLeft: 60,
        ...regularButtonFont
    },
    disableBtn: {
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 40,
        borderRadius: 8,
        marginRight: 60,
        marginLeft: 60,
        ...regularButtonFont
    },
    whiteText: {
        color: '#fff',
        ...regularButtonFont
    },
    blackText: {
        color: '#000',
        ...regularButtonFont
    }

});