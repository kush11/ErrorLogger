import React, { Component } from 'react';
import {
    View, Image, StyleSheet, Text,
    Platform, TouchableHighlight, TouchableOpacity,
    Dimensions, Keyboard, ImageBackground, ScrollView,
    Switch, AsyncStorage, ActivityIndicator, TextInput
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Badge, Card, List, ListItem, Footer, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux';
import Base64 from 'react-native-image-base64'
import UserGetImageService from '../../api/userImage/UserImageGetService'
import UserImagePostService from '../../api/userImage/UserImagePostService'
import UserImageStoreService from '../../api/userImage/userImageStoreService'
import { GoogleSignin } from 'react-native-google-signin';
import { updateUsername, updateDob, updateUserSocialImage, updateFetchedUrl, resetState } from '../../store/actions/index'
import { updateCurrentFlow } from '../../store/actions/assessment';
import { getImageHandler } from '../../components/utility/userImage/GetUserImage'
import Dialog from "react-native-dialog";

import FBSDK, {
    LoginManager, AccessToken, LoginButton, GraphRequest,
    GraphRequestManager
} from 'react-native-fbsdk'
import { BASE_URL, headers } from '../../api/config/Config';
import BottomZulTabs from '../../components/ui/navigation/BottomZulTabs';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
    uName: state.User.name,
    uSocialImage: state.User.socialImage,
    fetchedUrl: state.User.fetchedURL,
    gender: state.User.gender
})
const mapDispatchToProps = dispatch => ({
    imageUrl: (user) => dispatch(imageUrl(user)),
    updateUserName: (name) => dispatch(updateUsername(name)),
    updateFetchedUrl: (url) => dispatch(updateFetchedUrl(url)),
    updateUserSocialImage: (uri) => dispatch(updateUserSocialImage(uri)),
    updateDob: (dob) => dispatch(updateDob(dob)),
    updateCurrentFlow: (flow) => dispatch(updateCurrentFlow(flow)),

    resetState: () => dispatch(resetState())
})


class UserSettings extends Component {
    state = {
        isRegister: true,
        pickedImage: null,
        dataBase64: '',
        imageUrl: '',
        count: 0,
        spinner: true,
        isDialogVisible: false,
        inviteCode: ''
    };

    componentWillMount(){
        this.setState({
            spinner:false
        })
    }

    update = () => {
        this.props.updateUserSocialImage('')
        Toast.show({
            text: "Updated Successfully....",
            duration: 2000,
            type: 'default'
        });
        this.setState({ spinner: false, count: 0 })
    }

    uploadImage = () => {
        UserImagePostService.fetchUserPostData(this.state.dataBase64)

            .then((responseJson) => {
                console.log("responseJson", responseJson)
                const profileImage = {
                    image: responseJson,
                    user: this.props.uName
                }
                this.setState({
                    imageUrl: profileImage
                })
                console.log("profileImage", profileImage)
                UserImageStoreService.fetchUserStoreData(profileImage)
            })
            .then(() => {
                setTimeout(() => {
                    // this.getImageHandler()
                    getImageHandler(this.props.uName, this.props.updateFetchedUrl)
                }, 1000)
                if (this.state.count > 0) {
                    setTimeout(() => {
                        this.update()
                    }, 2500)
                }
            })

    }

    pickImageHandler = () => {
        const options = {
            title: 'Choose Profile Picture',
            maxWidth: 512,
            maxHeight: 512,
            cameraType: 'front',
            rotation: 0,
            allowsEditing: true,

        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log("data after image picker", response)
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else {
                const source = {
                    uri: response.uri,
                    base64: response.data
                };
                Base64.getBase64String(response.uri)
                    .then(data => this.setState({ dataBase64: data }))

                    .catch(err => console.log(err))
                this.setState({
                    pickedImage: source,
                    count: 1,
                    spinner: true
                });
                setTimeout(() => {
                    this.uploadImage();
                }, 1000)
            }
        }
        );

    };

    logout = async () => {
        await this.props.resetState()
        this.signOut();
        this.props.navigation.navigate("StartPage");
        this.props.updateCurrentFlow("UNREGISTERED");

    }
    signOut = async () => {
        this.props.updateDob(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('UserSocialImage');
        if (await GoogleSignin.isSignedIn()) {
            await GoogleSignin.signOut();
        }
        if (AccessToken.getCurrentAccessToken()) {
            await LoginManager.logOut()
        }
    };
    changeAuthMode = () => {
        this.setState(prevState => {

            return {
                isRegister: !prevState.isRegister
            };
        });
    }
    mapInviteCode = () => {

        fetch(BASE_URL + '/api/mapInviteCodeToUserFromSettings', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                userName: this.props.uName,
                inviteCode: this.state.inviteCode.trim()
            })
        }).then((response) => response.json(),
            this.setState({
                inviteCode: ''
            }))
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.error) {

                    Toast.show({
                        text: responseJson.error,
                        duration: 2000,
                        type: 'default'
                    });
                }
                else {

                    Toast.show({
                        text: "Invite Code Added..",
                        duration: 2000,
                        type: 'default'
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    dailogVisible = () => {
        this.setState((prevState, currentProps) => {
            return { isDialogVisible: !prevState.isDialogVisible };
        });
    }
    submit = () => {
        if (this.state.inviteCode.trim() === '') {
            Toast.show({
                text: 'Please enter a valid invite code..',
                duration: 2000,
                type: 'default'
            });
        }
        else {
            this.dailogVisible();
            this.mapInviteCode();
        }

    }

    render() {
        const list = [
            { 'label': 'Personal Settings', 'func': 'PersonalSetting', 'Icon': 'user-circle-o' },
            { 'label': 'Privacy Settings', 'func': 'PrivacySetting', 'Icon': 'lock' },
            // { 'label': 'Terms & Conditions', 'func': '' },

            { 'label': 'Change Passcode', 'func': 'ChangePasscode', 'Icon': 'key' },
            { 'label': 'Add Invite Code', 'func': '', 'Icon': 'envelope-open' },
            { 'label': 'Help', 'func': 'ReportIssue', 'Icon': 'question-circle-o' },
            { 'label': 'Logout', 'func': 'logout', 'Icon': 'sign-out' },

        ]

        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}keyboardShouldPersistTaps={"handled"}>
                    <Dialog.Container visible={this.state.isDialogVisible} style={{ borderRadius: 8 }}>
                        <Dialog.Title style={styles.titleStyle}>
                            {"Add Invite Code"}
                        </Dialog.Title>
                        <Dialog.Description style={styles.descStyle}>
                            {"Please enter your invite code below"}
                        </Dialog.Description>
                        <Dialog.Input
                         style={styles.dialogInput}
                         maxLength={6}
                         placeholder={'Enter invite code'}
                         onChangeText={async (inputText) => await this.setState({ inviteCode: inputText })}>
                        </Dialog.Input>
                        <Dialog.Button label={"Cancel"} onPress={this.dailogVisible} />
                        <Dialog.Button label={"Submit"} onPress={this.submit} />
                    </Dialog.Container>

                    <View style={styles.imageFlex} >
                        <TouchableOpacity onPress={this.pickImageHandler}>
                            <View style={styles.image}>
                                {this.state.spinner ?
                                    <ActivityIndicator animating={this.state.spinner} color="rgb(66, 159, 247)" size="large" />
                                    :
                                    <Image style={styles.imagesrc}
                                        source={(this.props.fetchedUrl !== null && this.props.fetchedUrl !== '') ?
                                            { uri: this.props.fetchedUrl } :
                                            (this.props.uSocialImage !== null && this.props.uSocialImage !== '') ?
                                                { uri: this.props.uSocialImage } :
                                                (require('../../assets/logo/login-user-icon.png'))}
                                        accessible={true}
                                        accessibilityLabel="Profile Picture"
                                        accessibilityHint="User Profile Picture">
                                    </Image>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                    <ListItem>
                        <View style={styles.userName} >
                            <View >
                                <Text style={{
                                    fontSize: 25, textAlign: 'center', color: '#144E76', ...usernameFontStyle,
                                }}>{this.props.uName}</Text>
                            </View>
                        </View>
                    </ListItem>


                    <View style={styles.touchID} >

                        <List>

                            {list.map((Names, i) => (


                                <ListItem key={Names.func} onPress={({ Name = Names.func }) => { i !== 3 ? i !== 5 ? this.props.navigation.navigate(Name) : this.logout() : this.dailogVisible() }}>

                                    <Left>
                                        <View style={styles.list}>
                                            <View style={{ alignItems: 'center', alignSelf: 'center', width: 50 }}>
                                                <Icon name={Names.Icon} size={20} color={'grey'} />
                                            </View>
                                            <View><Text style={styles.listText}>{Names.label}</Text></View>

                                        </View>
                                    </Left>

                                    <Body>

                                    </Body>
                                    <Right>
                                        {i !== 5 ?
                                            <Icon name="angle-right" size={20} color={'grey'} /> : null
                                        }
                                    </Right>
                                </ListItem>

                            ))}

                        </List>

                    </View>
                </ScrollView >
                <BottomZulTabs navigator={this.props.navigation} activeTab={'settings'} />
            </View>
        )
    }
}

const menuItemFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const usernameFontStyle = fontMaker({ family: 'OpenSans', weight: 'Bold' });
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
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    logoutContainer: {
        width: '40%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    imageFlex: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    list: {
        flex: 1,
        flexDirection: 'row',
    },
    listText: {
        fontSize: 16,
        color: 'black',
        paddingLeft: 5,
        width: '100%',
        ...menuItemFontStyle
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
        justifyContent: "center"
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
    HomeBtn: {
        width: "40%",
        backgroundColor: '#2980b9',
        marginHorizontal: 10,
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 8,
        marginTop: 10,
        borderRadius: 8,
        marginLeft: 60,
        marginRight: 60
    },
    whiteText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'System',
    },
    titleStyle: {
        color: "black",
        alignSelf: 'center'
    },
    descStyle: {
        color: "black"
    },
    dialogInput: {
        ...Platform.select({
            ios: {
                padding:10
            }
        }),
        paddingHorizontal: 10
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);