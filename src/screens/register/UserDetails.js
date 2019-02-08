import React from 'react';
import { Platform, View, StyleSheet, TextInput, TouchableOpacity, Image, Alert, AsyncStorage } from 'react-native';
import { Text, Left, Right, Toast } from 'native-base';
import { connect } from 'react-redux';
import {
    updateUsername, updateMobile, updateEmail, updateOtp, updateGender, updateInviteCode,
    updateDob, updateUserSocialImage, updateHeight, updateWeight
} from '../../store/actions/index';
import FloatingLabel from '../../components/ui/floatingLabel/floatingLabel';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button'
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import Icons from 'react-native-vector-icons/Ionicons'
import { BASE_URL, headers } from '../../api/config/Config';
import { regularButtonFont } from '../../components/utility/fonts/FontMaker'


const mapStateToProps = state => ({
    currentFlow: state.Assessment.currentFlow,
    uname: state.User.name,
    uDob: state.User.dob,
    image: state.User.socialImage
})
const mapDispatchToProps = dispatch => {
    return {
        updateName: (name) => dispatch(updateUsername(name)),
        updateMobile: (mobile) => dispatch(updateMobile(mobile)),
        updateEmail: (email) => dispatch(updateEmail(email)),
        updateOtp: (mobile) => dispatch(updateOtp(mobile)),
        updateGender: (gender) => dispatch(updateGender(gender)),
        updateDob: (dob) => dispatch(updateDob(dob)),
        updateUserSocialImage: (img) => dispatch(updateUserSocialImage(img)),
        updateHeight: (height) => dispatch(updateHeight(height)),
        updateWeight: (weight) => dispatch(updateWeight(weight)),
        updateInviteCode: (inviteCode) => dispatch(updateInviteCode(inviteCode))
    }
}

class UserDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mobile: '',
            email: '',
            buttonDisable: true,
            gender: 'Male',
            inviteCode: '',
            dobText: '',
            dobDate: null,
            showAlert: false,
            alertMessage: ''
        };

    };
    // Button Disable
    Button_Disable = () => {
        setTimeout(() => {
            if (this.state.name != '' && this.state.mobile.length != '') {

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
    // save register 
    registerUser = async () => {
        const regex = /^[_a-zA-Z]+([._]?[a-zA-Z0-9]+)*$/
        // console.log("name:"+this.state.name)
        // console.log("regex:"+regex.test(this.state.name))
        if (this.state.name.trim() === '' || !regex.test(this.state.name)) {
            this.props.showAlert('Oops!', 'Please enter valid Username', 'danger', 'Close')
            await this.setState({ name: '' })
        }
        else if (this.state.mobile.length != 10) {
            this.props.showAlert('Oops!', 'Please enter valid mobile number', 'danger', 'Close')
        }
        else if (this.state.dobDate === '') {
            this.props.showAlert('Oops!', 'Please enter Date Of Birth', 'danger', 'Close')
        }
        else {
            fetch(BASE_URL + '/api/registrationValidation', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: this.state.name.trim(),
                    mobile: this.state.mobile,
                    inviteCode: this.state.inviteCode ? this.state.inviteCode.trim() : ""
                })
            }).then((response) => response.json())
                .then(async (responseJson) => {
                    if (responseJson.hasOwnProperty('status')) {
                        await (
                            this.props.updateName(this.state.name),
                            this.props.updateMobile(this.state.mobile !== '' ? this.state.mobile : null),
                            this.props.updateEmail(this.state.email),
                            //this.props.updateGender(this.state.gender),
                            //this.props.updateDob(this.state.dobText),
                            this.props.updateInviteCode(this.state.inviteCode)
                        )
                        this.props.nextHandler();
                    }
                    else if (responseJson.hasOwnProperty('err')) {
                        this.props.showAlert('Oops!', responseJson.err, 'danger', 'Close');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
    onDOBPress = () => {
        let dobDate = this.state.dobDate;

        if (!dobDate || dobDate == null) {
            dobDate = new Date(moment().year() - 12, 0, 0);
            this.setState({
                dobDate: dobDate
            });
        }
        //To open the dialog
        this.refs.dobDialog.open({
            mode: 'spinner',
            date: dobDate,
            maxDate: new Date(moment().year() - 12, 0, 0), //To restirct future date,
            minDate: new Date(moment().year() - 99, 0, 0) //To restrict past date to 100 year
        });
    }
    onDOBDatePicked = (date) => {
        this.setState({
            dobDate: date,
            dobText: moment(date).format('MM-DD-YYYY')
        });
        this.Button_Disable();
    }
    onSelect = (index, value) => {
        this.setState({
            gender: value
        })
    }


    render() {
        return (
            <View style={styles.container} >

                <View style={styles.container}>
                    <FloatingLabel
                        underlineColorAndroid="#fff"
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        style={styles.customStyle}
                        value={this.state.name}
                        onChangeText={async (text) => {
                            await this.setState({ name: text.replace(" ", '').trim() });
                            this.Button_Disable();
                        }}
                        accessible={true}
                        accessibilityLabel="Username"
                        accessibilityHint="Provide Username">
                        Username</FloatingLabel>
                </View>
                <View>
                    {/* <View> */}
                    {/* <FloatingLabel
                        underlineColorAndroid="#fff"
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        style={styles.customStyle}
                        onFocus={this.onDOBPress.bind(this)}
                        onChangeText={this.onDOBPress.bind(this)}
                        value={this.state.dobText}
                        accessible={true}
                        accessibilityLabel="Date of Birth"
                        accessibilityHint="Provide Date of Birth"
                    >
                        Date Of Birth
                        </FloatingLabel> */}
                    {/* <Icons name="md-calendar" size={25} color={'white'} style={{ marginLeft: '60%', justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end' }} />  */}
                    

                    {/* </View> */}
                    {/* <View style={{ alignSelf: 'flex-end' }}>
                    </View> */}

                </View>


                {/* <View>
                    <Text style={{ marginLeft: 10, color: 'white', fontSize: 20 }}>Date of Birth</Text>
                    <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                        <View style={{ flexDirection: 'column' }} >
                            <View style={{ alignSelf: 'flex-end' }}>
                                <Icons name="md-calendar" size={25} color={'white'} style={{ alignSelf: 'flex-end' }} />
                            </View>
                            <View style={styles.datePickerBox}>
                                <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> */}
                <View>
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
                </View >
                {/* <View style={{ marginTop: 10 }}>
                    <Text style={{ marginLeft: 10, color: 'white', fontSize: 20 }}>Gender</Text>
                    <View>
                        <RadioGroup selectedIndex={0} style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row' }} color={'white'} onSelect={(index, value) => this.onSelect(index, value)} >

                            <RadioButton value={'Male'} color={'white'}>
                                <Text style={{ color: 'white' }}>Male</Text>
                            </RadioButton>


                            <RadioButton value={'Female'} color={'white'}>
                                <Text style={{ color: 'white' }}>Female</Text>
                            </RadioButton>


                            <RadioButton value={'Others'} color={'white'}>
                                <Text style={{ color: 'white' }}>Others</Text>
                            </RadioButton>

                        </RadioGroup>
                    </View>
                </View> */}

                <FloatingLabel
                    underlineColorAndroid="#fff"
                    labelStyle={style={fontSize:17,color: '#fff'}}
                    inputStyle={styles.inputStyle}
                    style={styles.customStyle}
                    onChangeText={(text) => { this.setState({ inviteCode: text }) }}
                    accessible={true}
                    accessibilityLabel="InviteCode"
                    accessibilityHint="Provide InviteCode"
                >Invite Code (Optional)</FloatingLabel>

                <View>
                    <TouchableOpacity style={this.state.buttonDisable ? styles.disableBtn : styles.zulBtn} onPress={this.registerUser} disabled={this.state.buttonDisable}>
                        <Text style={styles.whiteText}>{'Create new account'.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                < DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
            </View >
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);

const styles = StyleSheet.create({
    container: {

    },
    datePickerBox: {
        marginTop: 5,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        padding: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 20,
        justifyContent: 'center',
    },
    flexOne: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row'
    },
    datePickerText: {
        fontSize: 20,
        marginLeft: 5,
        borderWidth: 0,
        color: 'white',
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        fontSize: 20,
        color: '#fff'
    },
    zulBtn: {
        backgroundColor: '#41ab3e',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        borderRadius: 8,
        marginRight: 60,
        marginLeft: 60
    },
    disableBtn: {
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 10,
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

