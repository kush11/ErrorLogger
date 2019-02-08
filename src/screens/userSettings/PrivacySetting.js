import React, { Component } from 'react';
import { Platform, View, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions, Keyboard, ImageBackground, ScrollView, Switch, Alert, ToastAndroid } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Badge, Card, List, ListItem, Footer, Toast } from 'native-base';
import { saveTouchIdInfo, isTouchIdEnabled } from '../../repository/login/LoginRepository';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

class PrivateSetting extends Component {
    state = {
        isRegister: false
    };
    componentDidMount() {
        isTouchIdEnabled().then((isTouch) => {
            this.setState({
                isRegister: isTouch
            })
        });
    }
    toastMessage = () => {
        Toast.show({
            text: "This feature will be Available Soon",
            duration: 2000,
            type: 'default'
        })
    }
    changeAuthMode = () => {
        let userinfo = {};
        if (!this.state.isRegister) {
            Alert.alert(
                'Enable Touch Id',
                'Do you want to enable touch id?',
                [
                    {
                        text: 'NO', onPress: () => {
                            userinfo.enableTouchId = "false";
                            saveTouchIdInfo(userinfo);
                            this.setState(prevState => {

                                return {
                                    isRegister: false
                                };
                            });

                        }
                        , style: 'cancel'
                    },
                    {
                        text: 'YES', onPress: () => {
                            userinfo.enableTouchId = "true";
                            saveTouchIdInfo(userinfo);
                            this.setState(prevState => {

                                return {
                                    isRegister: true
                                };
                            });


                        }
                    },
                ],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'Disable Touch Id',
                'Do you want to disable touch id?',
                [
                    {
                        text: 'NO', onPress: () => {
                            userinfo.enableTouchId = "true";
                            saveTouchIdInfo(userinfo);
                            this.setState(prevState => {

                                return {
                                    isRegister: true
                                };
                            });

                        }
                        , style: 'cancel'
                    },
                    {
                        text: 'YES', onPress: () => {
                            userinfo.enableTouchId = "false";
                            saveTouchIdInfo(userinfo);
                            this.setState(prevState => {

                                return {
                                    isRegister: false
                                };
                            });


                        }
                    },
                ],
                { cancelable: false }
            )
        }

    }
    render() {
        const authModeSelectionSection = (
            <View style={styles.authModeContainer}>
                {/* <View ><Text style={styles.authModeText}>OFF</Text></View> */}
                {(Platform.OS === 'ios') ?
                    <Switch
                        onValueChange={this.changeAuthMode}
                        thumbTintColor={this.state.isRegister ? "#4b7aa5" : "#cccccc"}
                        onTintColor="#00264a"
                        value={this.state.isRegister}
                        style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}>

                    </Switch> :
                    <Switch
                        thumbTintColor={this.state.isRegister ? "#4b7aa5" : "#cccccc"}
                        onTintColor="#00264a"
                        value={this.state.isRegister}
                        style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                        onValueChange={this.changeAuthMode}
                    ></Switch>}

            </View>
        )

        return (
            <View style={styles.container}>
                <List>
                    <ListItem>

                        <Left>
                            <View style={styles.list}>
                                <View><Text style={styles.listText}>Enable Touch Id</Text></View>

                            </View>
                        </Left>


                        <Body>

                        </Body>
                        <Right style={{ alignContent: 'center' }}>
                            <View>
                                {authModeSelectionSection}
                            </View>

                        </Right>
                    </ListItem>
                    {/* <ListItem>

                        <Left>
                            <View style={styles.list}>
                                <View><Text style={styles.listText}>Enable Face Id</Text></View>

                            </View>
                        </Left>


                        <Body>

                        </Body>
                        <Right style={{ alignContent: 'center' }}>
                            <View>
                                <Switch thumbTintColor='#fff' onValueChange={this.toastMessage}>
                                </Switch>
                            </View>

                        </Right>
                    </ListItem> */}


                    {/* <ListItem>

                        <Left>
                            <View style={styles.list}>
                                <View><Text style={styles.listText}>Enable Passcode</Text></View>

                            </View>
                        </Left>


                        <Body>

                        </Body>
                        <Right style={{ alignContent: 'center' }}>
                            <View>
                                <Switch thumbTintColor='#fff'>
                                </Switch>
                            </View>

                        </Right>
                    </ListItem> */}
                </List>
            </View>
        )
    }
}

const itemFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const alertTitleFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const alertmessageFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
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
        margin: 10,
    },

    list: {
        flexDirection: 'row',
    },
    listText: {
        fontSize: 18,
        textAlign: "center",
        color: 'black',
        ...itemFontStyle
    },
})
export default PrivateSetting