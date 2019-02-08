import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions, Keyboard, ImageBackground, ScrollView, Switch } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Badge, Card, List, ListItem, Footer } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux';
import Base64 from 'react-native-image-base64'
import Modal from 'react-native-modal'
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button'
import Icon1 from 'react-native-vector-icons/EvilIcons';
import { updateWeight, updateHeight, updateBmi, updateGender, updateDob } from '../../store/actions/index'
import moment from 'moment';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import { BASE_URL, headers } from '../../api/config/Config';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import Dialog from "react-native-dialog";


const deviceHeight = Dimensions.get("window").height;

const mapStateToProps = state => ({
    uName: state.User.name,
    uHeight: state.User.height,
    uWeight: state.User.weight,
    uBmi: state.User.bmi,
    uDob: state.User.dob,
    uGender: state.User.gender
})
const mapDispatchToProps = dispatch => ({
    updateWeight: (weight) => dispatch(updateWeight(weight)),
    updateHeight: (height) => dispatch(updateHeight(height)),
    updateBmi: (bmi) => dispatch(updateBmi(bmi)),
    updateGender: (gender) => dispatch(updateGender(gender)),
    updateDob: (dob) => dispatch(updateDob(dob))
})

class PersonalSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: 'Male',
            dobText: '',
            dobDate: null,
            modalVisible: false,
            index:null
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
                    this.props.updateDob(responseJson.dob),
                    this.setState({index:responseJson.gender==='Male'?0:responseJson.gender==='Female'?1:index.responseJson.gender==='Others'?2:null})
            })
    }


    onDOBPress = async () => {
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
            maxDate: new Date(moment().year() - 12, 0, 0, 0), //To restirct future date,
            minDate: new Date(moment().year() - 99, 0, 0, 0) //To restrict past date to 100 year
        });

    }
    onDOBDatePicked = async (date) => {
        await this.setState({
            dobDate: date,
            dobText: moment(date).format('MM-DD-YYYY')
        });
        this.props.updateDob(this.state.dobDate)

        fetch(BASE_URL + '/api/user/updateUserDob', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: this.props.uName,
                dob: this.state.dobText
            })
        }).then((response) => response.json())
    }

    onSelect = (index, value) => {
        this.setState({
            gender: value,
            index:index
        })
    }

    toggleModal = () => {
        this.setState((prevState, currentProps) => {
            return { modalVisible: !prevState.modalVisible,
                index:prevState.index

            };
        });
    }


    submitGender = () => {
        this.toggleModal(),
            this.props.updateGender(this.state.gender)

        fetch(BASE_URL + '/api/user/updateUserGender', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: this.props.uName,
                gender: this.state.gender
            })
        }).then((response) => response.json())
    }
    render() {
        const list = [
            { 'name': 'Display Name', 'func': '', 'label': this.props.uName },
            { 'name': 'Date of Birth', 'func': '', 'label': this.props.uDob ? moment(this.props.uDob).format('LL') : 'N.A.' },
            { 'name': 'Gender', 'func': '', 'label': this.props.uGender ? this.props.uGender : 'N.A.' },
            { 'name': 'BMI', 'func': '', 'label': this.props.uBmi ? this.props.uBmi : 'N.A.' },
            { 'name': 'Height', 'func': 'ChangeHeight', 'label': this.props.uHeight === 0 || !isFinite(this.props.uHeight) ? 'Set your height' : (this.props.uHeight + ' cm') },
            { 'name': 'Weight', 'func': 'ChangeWeight', 'label': this.props.uWeight === 0 || !isFinite(this.props.uWeight) ? 'Set your weight' : (this.props.uWeight + ' kg') }]

        return (

            <View style={styles.container}>
                <Dialog.Container visible={this.state.modalVisible} >
                    <Dialog.Title style={{ color: "black", alignSelf: 'center' }}>
                        {"Select Gender"}
                    </Dialog.Title>
                    <RadioGroup selectedIndex={this.state.index} style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row' }} color={'black'} onSelect={(index, value) => this.onSelect(index, value)} >

                        <RadioButton value={'Male'} color={'black'}>
                            <Text style={{ color: 'black', fontSize: 16 }}>Male</Text>
                        </RadioButton>


                        <RadioButton value={'Female'} color={'black'}>
                            <Text style={{ color: 'black', fontSize: 16 }}>Female</Text>
                        </RadioButton>


                        <RadioButton value={'Others'} color={'black'}>
                            <Text style={{ color: 'black', fontSize: 16 }}>Others</Text>
                        </RadioButton>

                    </RadioGroup>

                    <Dialog.Button label={"Cancel"} onPress={this.toggleModal} />
                    <Dialog.Button label={"Submit"} onPress={this.submitGender} />
                </Dialog.Container>
                <ScrollView contentContainerStyle={{ flex: 1, marginTop: 10 }}>
                    <View style={styles.touchID} >
                        <List>
                            {list.map((Names, i) => (
                                <ListItem key={i} onPress={({ Name = Names.func }) => { i === 1 ? (this.props.uDob ? (this.props.uDob !== '' ? null : this.onDOBPress()) : this.onDOBPress()) : i === 2 ? this.toggleModal() : this.props.navigation.navigate(Name) }}>

                                    <Left>
                                        <View style={styles.list}>
                                            <View><Text style={styles.listText}>{Names.name}</Text></View>

                                        </View>
                                    </Left>

                                    <Body>
                                        <Text style={{ fontSize: 14, color: 'grey', alignSelf: "flex-end", ...valueFontStyle }}>{Names.label}</Text>
                                    </Body>

                                    {i === 4 || i === 5 ?
                                        <Right>
                                            {Names.name === 'Display Name' || Names.name === 'Date of Birth' || Names.name === 'Gender' || Names.name === 'BMI' ? null :
                                                <Icon name="angle-right" size={20} color={'grey'} />}
                                        </Right> : null
                                    }
                                </ListItem>
                            ))}
                        </List>
                    </View>

                </ScrollView>
                < DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
            </View >

        )
    }
}

const itemFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const valueFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    authModeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
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
        ...itemFontStyle
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