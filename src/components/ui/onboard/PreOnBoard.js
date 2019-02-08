import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, AsyncStorage, Animated, TouchableOpacity, ScrollView, Easing, ImageBackground } from 'react-native';
import { Text } from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import {autoLogin} from '../../../api/StartPage/AutoLogin'
import { connect } from 'react-redux';
import { updateUsername, updateUserSocialImage, updateDob, updateEmail, updateHeight, updateWeight } from '../../../store/actions/users';
import { updateCurrentFlow } from '../../../store/actions/assessment';
import { regularButtonFont } from '../../utility/fonts/FontMaker'

const windowDimensions = Dimensions.get("window");

const mapDispatchToProps = dispatch => ({
    updateUsername: (name) => dispatch(updateUsername(name)),
    updateCurrentFlow: (flow) => dispatch(updateCurrentFlow(flow)),
    updateUserSocialImage: (image) => dispatch(updateUserSocialImage(image)),
    updateDob: (dob) => dispatch(updateDob(dob)),
    updateEmail: (email) => dispatch(updateEmail(email)),
    updateCurrentFlow: (status) => dispatch(updateCurrentFlow(status)),
    updateHeight: (height) => dispatch(updateHeight(height)),
    updateWeight: (weight) => dispatch(updateWeight(weight))
})

class PreOnBoard extends Component {
    state = {
        autoLogin: false,
        spinValue: new Animated.Value(0)
    }

    componentWillMount() {
        AsyncStorage.getItem('isFirstTimeUser', (err, result) => {
            if (result === 'false') {
                this.setState(
                    {
                        autoLogin: true
                    });
                this.autologin();
            }
            else {
                this.setState(
                    {
                        autoLogin: false
                    });
            }
        });
    }

    _done = () => {
        AsyncStorage.setItem('isFirstTimeUser', "false", (err, result) => {

            this.props.navigation.navigate("LoginRoute")

        });

    }
    autologin = () => {
        this.props.updateCurrentFlow('REGISTERED')
        AsyncStorage.getItem('userToken').then(token => {
            autoLogin(token).then((responseJson) => {
                try {
                    if (responseJson.name === 'JsonWebTokenError') {
                        this._done()
                    }
                    else {
                        this.props.updateUsername(responseJson.name);
                        this.props.updateDob(responseJson.dob);
                        this.props.updateHeight(responseJson.height);
                        this.props.updateWeight(responseJson.weight);
                        AsyncStorage.getItem('UserSocialImage').then(socialImage => {
                            this.props.updateUserSocialImage(socialImage)
                        })
                        this.props.navigation.navigate("OverviewRoute");
                    }
                } catch (ex) {
                    console.error(ex);
                }
            }).catch((error) => {
                console.log(err)
            });
        })
    }
    componentDidMount() {
        Animated.sequence([
            Animated.loop(
                Animated.sequence([
                    Animated.timing(
                        this.state.spinValue,
                        {
                            toValue: 1,
                            duration: 20000
                        }
                    ),
                    Animated.timing(
                        this.state.spinValue,
                        {
                            toValue: 0,
                            duration: 20000
                        }
                    )
                ])
            )
        ]).start()

    }



    render() {
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (

            <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.sliderContainer}>
                    <Text style={{ fontSize: 22, textAlign: 'center', color: '#000' }}>Welcome To</Text>
                    <Image style={styles.loginLogo} source={require('../../../assets/images/onboard/zulNew.png')} />
                    <Text style={{ fontSize: 22, textAlign: 'center', color: '#000' }}>Re-Discover Yourself</Text>
                    <View
                        style={{
                            display: "flex",
                            height: Dimensions.get('window').width,
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>
                        <Image
                            style={{
                                alignSelf: "center",
                                alignSelf: 'center',
                                position: "absolute"
                            }}
                            source={require('../../../assets/images/onboard/zulsmalllogo.png')}></Image>
                        <Animated.Image
                            style={{
                                transform: [{ rotate: spin }],
                                marginBottom: -80,
                                height: Dimensions.get('window').width,
                                width: Dimensions.get('window').width,
                            }}
                            source={require('../../../assets/images/onboard/dimension.png')} />
                    </View>
                    {/* <View style={styles.text}>
                            <Text style={{ fontSize: 25, textAlign: 'center', color: '#000', fontWeight: 'bold' }}>All your wellbeing in one place</Text>
                        </View> */}
                    {this.state.autoLogin ? null :
                        <TouchableOpacity style={styles.logInBtn} onPress={() => { this.props.navigation.navigate('OnBoard') }}>
                            <Text style={{ color: '#fff', ...regularButtonFont }}>{'Continue'.toUpperCase()}</Text>
                        </TouchableOpacity>}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    sliderContainer: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginLogo: {
        marginTop: 10,
        marginBottom: 20
    },

    Logo: {
        // height: 500,
        marginBottom: -80,
        //width: 350        
    },
    text: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: -50,
        padding: 10
    },
    logInBtn: {
        backgroundColor: '#41ab3e',
        alignItems: 'center',
        paddingVertical: 12,
        width: 130,
        borderRadius: 8,
        marginBottom: 20,
    },
})


export default connect(null, mapDispatchToProps)(PreOnBoard);