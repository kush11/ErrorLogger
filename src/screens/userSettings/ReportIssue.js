import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Linking, ImageBackground, ScrollView, TextInput, Platform, ActivityIndicator, Alert } from 'react-native';
import { Text, Button } from 'native-base';
const windowDimensions = Dimensions.get("window");
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker'
import Mailer from 'react-native-mail';
import {regularButtonFont, defaultModalFont} from '../../components/utility/fonts/FontMaker';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = state => ({
    //   currentFlow: state.Assessment.currentFlow,
    //   tempHeight:state.User.tempheight
})
class Register extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            pickedImage1: '',
            pickedImage2: '',
            pickedImage3: '',
            pickedImage1Path: '',
            pickedImage2Path: '',
            pickedImage3Path: '',
            count: 1,
            spinner: false,
            showSCLAlert:false
        };

    }
    
    pickImageHandler = (choice) => {
        ImagePicker.showImagePicker(
            {
                title: "Choose Profile Image"
            },
            response => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                } else if (response.error) {
                    console.log("ImagePicker Error: ", response.error);
                } else {
                    console.log("respnse data", response)
                    const source = {
                        uri: response.uri,
                        // base64: response.data
                    };
                    if (choice === 1) {
                        this.setState({
                            pickedImage1: source,
                            count: 1,
                            pickedImage1Path: response.path
                            //spinner: true
                        });
                    }
                    else if (choice === 2) {
                        this.setState({
                            pickedImage2: source,
                            count: 1,
                            pickedImage2Path: response.path
                            //spinner: true
                        });
                    }
                    else {
                        this.setState({
                            pickedImage3: source,
                            count: 1,
                            pickedImage3Path: response.path
                            //spinner: true
                        });
                    }
                }
            }
        );

    };

    handleEmail = () => {
        Linking.openURL('mailto:support@zinguplife.zohodesk.com?subject=Question about Zing up life&body='+this.state.query);
        // Mailer.mail({
        //     subject: 'Question about Zing up life',
        //     recipients: ['support@zinguplife.zohodesk.com'],
        //     body: this.state.query,
        //     isHTML: true,
        // }, (error, event) => {
            
        // });
        this.props.navigation.goBack();
    }

   handleClose = ()=>{
       this.setState({showSCLAlert:false});
   }
    handleOpen = ()=>{
       this.setState({showSCLAlert:true});
   }
    render() {

        return (
            <View style={styles.container}>
            <SCLAlert
                    theme="danger"
                    show={this.state.showSCLAlert}
                    title={"Oops!"}
                    subtitle="Query field must be filled"
                    onRequestClose={this.handleClose}
                    titleStyle={{...defaultModalFont}}
                    subtitleStyle={{...defaultModalFont}}
                >
                    <SCLAlertButton theme="danger" onPress={this.handleClose} textStyle={{...regularButtonFont}}
>OK</SCLAlertButton>
                </SCLAlert>
                <View style={{marginLeft:25,marginRight:25}}>
                    {/* <Text style={{ marginBottom: 20, fontSize: 18, marginLeft: 10 }}>Enter your Query:</Text> */}
                    <TextInput                        
                        underlineColorAndroid="#144E76"
                        maxLength={500}
                        multiline={true}
                        placeholder={"Please describe your problem"}        
                        style={styles.customStyle}                
                        onChangeText={(text) => { this.setState({ query: text }) }}
                        accessible={true}                        
                        accessibilityLabel="Enter Query"
                        accessibilityHint="Provide Query"
                    />
                    <TouchableOpacity style={styles.zulBtn}
                         onPress={() =>this.state.query.trim(' ').length!==0 ?this.handleEmail():this.handleOpen() }                        
                        >
                        <Text style={styles.whiteText}>NEXT</Text>
                    </TouchableOpacity>
                </View>

            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    blackMatLayer: {
        backgroundColor: '#00000054',
        position: 'absolute',
        top: 20,
        bottom: 40,
        left: 10,
        right: 10
    },
    customStyle: {
        fontSize: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor:"#41ab3e",
        height:100,
        width:'100%'
    },
    zulBtn: {
        backgroundColor: '#41ab3e',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        marginTop: 30,
        borderRadius: 8,
        marginRight: 60,
        marginLeft: 60
        
    },
    whiteText: {
        color: '#fff',
        fontSize: 15,
        // fontWeight: 'bold',
        ...regularButtonFont
    },
    image: {
        borderWidth: 1,
        borderColor: "black",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 200,
        borderRadius: 25
    },
    imagesrc: {
        height: 200,
        width: 200,
        borderRadius: 25
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Register);
