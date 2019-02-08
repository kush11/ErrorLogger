import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions, TextInput, Keyboard, ImageBackground, ScrollView, Switch } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Badge, Card, List, ListItem, Footer } from 'native-base';
import { connect } from 'react-redux';
import { updateTempHeight, updateTempWeight, updateTempDob, updateWeight, updateHeight, updateDob } from '../../store/actions/index'
import moment from 'moment'
import CalculateBmi from '../../components/utility/bmi/Bmi'
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import { BASE_URL, headers } from '../../api/config/Config';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { fontMaker, regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';
const deviceHeight = Dimensions.get("window").height;

const mapStateToProps = state => ({
    currentAssessment: state.Assessment.currentAssessment,
    uName: state.User.name,
    uHeight: state.User.height,
    uWeight: state.User.weight,
    uDob: state.User.dob
})
const mapDispatchToProps = dispatch => ({
    updateWeight: (weight) => dispatch(updateWeight(weight)),
    updateHeight: (height) => dispatch(updateHeight(height)),
    updateBmi: (bmi) => dispatch(updateBmi(bmi)),
    updateGender: (gender) => dispatch(updateGender(gender)),
    updateDob: (dob) => dispatch(updateDob(dob)),
    updateTempHeight: (dob) => dispatch(updateTempHeight(dob)),
    updateTempWeight: (dob) => dispatch(updateTempWeight(dob)),
    updateTempDob: (dob) => dispatch(updateTempDob(dob))
})

class PersonalSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {

            dobText: '',
            dobDate: null,
            buttonDisable: true,
            height: '',
            weight: '',
            showSCLAlert: false,
            alertTitle: "",
            alertMessage: ""
        };

    };
    componentWillMount() {
        fetch(BASE_URL + '/api/user/id', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: this.props.uName
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.updateHeight(responseJson.height),
                    this.props.updateWeight(responseJson.weight),
                    this.props.updateGender(responseJson.gender),
                    this.props.updateBmi(CalculateBmi(responseJson.height, responseJson.weight)),
                    this.props.updateDob(responseJson.dob)
            })
    }

    handleOpen = (title) => {
        this.setState({ showSCLAlert: true, alertMessage: title })
    }

    handleClose = () => {
        this.setState({ showSCLAlert: false, alertMessage: '' });
    }

    onDOBPress = async () => {
        let dobDate = null;

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
            maxDate: new Date(moment().year() - 12, 0, 0, 0), //To restirct future date,
            minDate: new Date(moment().year() - 99, 0, 0, 0) //To restrict past date to 100 year
        });

    }
    onDOBDatePicked = async (date) => {
        await this.setState({
            dobDate: date,
            dobText: moment(date).format('MM-DD-YYYY')
        });
        this.Button_Disable()
    }


    Button_Disable = () => {
        setTimeout(() => {
            if (this.state.dobText !== '' && this.state.height !== '' && this.state.weight !== '') {

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
    updateDetails = () => {
        const regex = /^[1-9]+[0-9]*$/
        if (this.state.height && this.state.weight) {
            if ((isFinite(this.state.height) && isFinite(this.state.weight))
                && regex.test(this.state.height) && regex.test(this.state.weight)) {
                if (this.state.height < 300 && this.state.weight < 634) {
                    if (this.props.uName === '') {
                        this.props.updateTempHeight(parseInt(this.state.height))
                        this.props.updateTempWeight(parseInt(this.state.weight))
                        this.props.updateTempDob(this.state.dobDate)
                    }
                    else {
                        fetch(BASE_URL + '/api/userData', {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({
                                name: this.props.uName,
                                height: this.state.height,
                                weight: this.state.weight,
                                dob: this.state.dobText
                            })
                        }).then((response) => response.json())
                            .catch((error) => {
                                console.error(error);
                            });
                        this.props.updateHeight(this.state.height)
                        this.props.updateWeight(this.state.weight)
                        this.props.updateDob(this.state.dobDate)
                    }
                    this.props.navigation.navigate('Assessment', { title: this.props.currentAssessment });
                } else {
                    this.handleOpen("Height must be in between '1-300' & Weight must be in between '1-634'");
                }
            }
            else {
                this.handleOpen("Height or Weight can not start with '0'.");
            }
        }
        else {
            this.handleOpen("To continue, please provide all the details.");
        }
    }
    render() {
        const list = [

            { 'name': 'Date of Birth', 'func': '', 'label': this.props.uDob ? moment(this.props.uDob).format('LL') : 'N.A.' },
            { 'name': 'Height', 'func': '', 'label': this.state.height === 0 || !isFinite(this.props.height) ? 'Set your height' : (this.props.height + ' cm') },
            { 'name': 'Weight', 'func': '', 'label': this.state.weight === 0 || !isFinite(this.props.weight) ? 'Set your weight' : (this.props.weight + ' kg') }]

        return (

            <View style={styles.container}>
                <SCLAlert
                    theme="danger"
                    show={this.state.showSCLAlert}
                    title={"Oops!"}
                    subtitle={this.state.alertMessage}
                    cancellable={true}
                    onRequestClose={this.handleClose}
                    subtitleStyle={{ width:290,family: 'OpenSans', weight: 'Regular', ...defaultModalFont}}
                    titleStyle={{ ...defaultModalFont }}
                >
                    <SCLAlertButton theme="danger" onPress={this.handleClose} textStyle={{ ...regularButtonFont }}>Close</SCLAlertButton>
                </SCLAlert>

                <ScrollView contentContainerStyle={{ flex: 1, marginTop: 10 }} keyboardShouldPersistTaps={"handled"} >
                    <View style={styles.touchID} >
                        <View>
                            <Text style={styles.title}>Please provide the below information to get started</Text>
                        </View>

                        <List>

                            <ListItem>

                                <Left>
                                    <View style={styles.list}>
                                        <View><Text style={styles.listText}>Date of Birth</Text></View>

                                    </View>
                                </Left>

                                <Body>

                                    <TextInput
                                        placeholder="Enter DOB"
                                        style={{ padding: 10, ...inputsFontStyle }}
                                        value={this.state.dobText}
                                        onFocus={this.onDOBPress.bind(this)}
                                        onChangeText={this.onDOBPress.bind(this)}
                                    ></TextInput>

                                </Body>
                            </ListItem>
                            <ListItem >

                                <Left>
                                    <View style={styles.list}>
                                        <View><Text style={styles.listText}>Height</Text></View>
                                        <View style={{ flexDirection: 'row', flex: 1 }}><Text style={{ fontSize: 15, color: 'grey', ...listTextFontStyle }}> (cm)</Text></View>

                                    </View>
                                </Left>

                                <Body>

                                    <TextInput
                                        placeholder="Enter Height"
                                        keyboardType={"numeric"}
                                        maxLength={3}
                                        style={{ padding: 10, ...inputsFontStyle }}
                                        value={this.state.height}
                                        onChangeText={async (text) => { await this.setState({ height: text.replace(/[^0-9]/g, '') }), this.Button_Disable() }}
                                    ></TextInput>

                                </Body>
                            </ListItem>
                            <ListItem >

                                <Left>
                                    <View style={styles.list}>
                                        <View><Text style={styles.listText}>Weight</Text></View>
                                        <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 15, color: 'grey', ...listTextFontStyle }}> (kg)</Text></View>

                                    </View>
                                </Left>

                                <Body>

                                    <TextInput
                                        placeholder="Enter Weight"
                                        keyboardType={"numeric"}
                                        maxLength={3}
                                        style={{ padding: 10, ...inputsFontStyle }}
                                        value={this.state.weight}
                                        onChangeText={async (text) => { await this.setState({ weight: text.replace(/[^0-9]/g, '') }), this.Button_Disable() }}
                                    ></TextInput>

                                </Body>
                            </ListItem>
                        </List>
                        <View>
                            <TouchableOpacity style={this.state.buttonDisable ? styles.disableBtn : styles.zulBtn} onPress={this.updateDetails} disabled={this.state.buttonDisable}>
                                <Text style={[styles.whiteText, { ...regularButtonFont, fontSize: 15 }]}>{'Submit'.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </ScrollView>
                < DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} cancelLabel="CANCEL" okLabel="OK" />
            </View >

        )
    }
}
const titleFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const listTextFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const inputsFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    authModeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    title: {
        fontSize: 15,
        paddingLeft: 15,
        ...titleFontStyle
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
    authModeText: {
        color: 'black',
        fontWeight: 'bold',
        marginRight: 10,
        marginLeft: 10
    },
    logInBtn: {
        backgroundColor: '#41ab3e',
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 30,
        borderRadius: 8,
        width: 130,
        marginRight: 75,
        marginLeft: 75,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    logoutContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        borderBottomColor: 'grey',
        borderTopColor: "grey",
        borderWidth: 1
    },

    imageFlex: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
    },
    list: {
        flexDirection: 'row',
    },
    listText: {
        fontSize: 16,
        color: 'black',
        ...listTextFontStyle
    },
    image: {
        borderWidth: 2,
        borderColor: "black",
        alignItems: "center",
        justifyContent: "center",
        height: 150,
        width: 150,
        borderRadius: 75
    },
    imagesrc: {
        height: 150,
        width: 150,
        borderRadius: 75
    },
    userName: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
    },
    touchID: {
        flex: 3,
        justifyContent: 'flex-start'
    },
    textWhite: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold'
    },
    modal: {
        paddingVertical: 200,
        width: 320,
        alignSelf: 'center'
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(PersonalSetting);