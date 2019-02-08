import React from 'react';
import { View, Image,Dimensions, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { NoFlickerImage } from 'react-native-no-flicker-image'
import { ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import AnimateNumber from 'react-native-animate-number';
import WallpaperAnimation from '../../assets/animations/WallpaperAnimation';
import { setAssessmentType, updateQuestions, updateCurrentQuestion, updateCurrentFlow } from '../../store/actions/index';

import GetUserCountService from "../../api/StartPage/UsersCountService";
import { updateUsername, updateFetchedUrl, updateUserSocialImage } from '../../store/actions/index'

import { BASE_URL, headers } from '../../api/config/Config';
import {fontMaker, regularButtonFont} from '../../components/utility/fonts/FontMaker';

const mapDispatchToProps = dispatch => ({
    getAllQuestion: (data) => dispatch(updateQuestions(data)),
    getCurrentQuestion: (data) => dispatch(updateCurrentQuestion(data)),
    setAssessmentType: (type) => dispatch(setAssessmentType(type)),
    updateCurrentFlow: (type) => dispatch(updateCurrentFlow(type)),
    updateUserName: (name) => dispatch(updateUsername(name)),
    updateFetchedUrl: (url) => dispatch(updateFetchedUrl(url)),
    updateUserSocialImage: (uri) => dispatch(updateUserSocialImage(uri))
})
class LandingComponent extends React.Component {  constructor() {
        super();
        this.wallpaperPaths = [
            { path: require('../../assets/images/startPage/1.jpg') },
            { path: require('../../assets/images/startPage/2.jpg') },
            { path: require('../../assets/images/startPage/3.jpg') },
            { path: require('../../assets/images/startPage/4.jpg') },
            { path: require('../../assets/images/startPage/5.jpg') },
            { path: require('../../assets/images/startPage/6.jpg') },
            { path: require('../../assets/images/startPage/7.jpg') },
            { path: require('../../assets/images/startPage/8.jpg') },
            { path: require('../../assets/images/startPage/9.jpg') }
        ];
        this.groupbuttons = [2, 0, 0, 8, 3];
        this.state = {
            imageURL: this.wallpaperPaths[0].path,
            buttons: [2, 0, 0, 8, 3],
            UserCount: 0
        }

    }


    componentDidMount() {
        let counterCount = 1;
        let i = 1;
        this.backInterval = setInterval(() => {
            this.setState({
                imageURL: this.wallpaperPaths[i].path,
            })
            i === 8 ? i = 0 : i++;
        }, 5000);
        // this.props.updateUserName('')
        // this.props.updateFetchedUrl('')
        // this.props.updateUserSocialImage('')
    }

    componentDidUpdate() {

    }

    componentWillMount() {
        this.UserCounter();
    }

    componentWillUnmount() {
        clearInterval(this.backInterval);
    }

    UserCounter = () => {
        GetUserCountService.fetchUsersCount()
            .then((responseJson) => {
                try {
                    this.setState({
                        UserCount: responseJson.totalCount
                    })

                } catch (ex) {
                    console.error(ex);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    changeCounter = () => {
        for (let i = 0; i < 8; i++) {
            this.groupbuttons[3] = i + 1;
            this.groupbuttons[4] = i + 2;
            this.setState({
                buttons: this.groupbuttons
            });
        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <WallpaperAnimation>
                    <NoFlickerImage style={styles.loginContainer} source={this.state.imageURL}>
                    </NoFlickerImage>
                </WallpaperAnimation>
                <View style={styles.loginInnerContainer}>
                    <View style={styles.logoContainer}>
                        <Image style={styles.loginLogo} source={require('../../assets/images/onboard/zulNew.png')} />
                        <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', ...logoTextFontStyle }}>Re-Discover Yourself</Text>
                    </View>

                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.statement}>We are helping</Text>
                            <View style={{ width: 100, height: 70, borderRadius: 25, backgroundColor: '#00000054', alignSelf: 'center', top: 3, flexDirection:'row', justifyContent:'center' }}>
                                <Text style={{ fontSize: 32, textAlign: 'center', color: '#fff', top: 15 }}>
                                    {/* Animation */}
                                    <AnimateNumber value={this.state.UserCount}
                                    countBy={1}
                                    timing={(interval, progress) => {
                                        // slow start, slow end
                                        return interval * (2 - Math.sin(Math.PI * progress)) * 10
                                    }} />

                                </Text>
                            </View>
                        <Text style={styles.statement}>people around the world to live <Text style={{fontWeight:'bold'}}>well</Text> and be <Text style={{fontWeight:'bold'}}>happy</Text></Text>
                    </View>  
                        <View style={{width:"100%"}}>
                            <TouchableOpacity style={styles.logInBtn} onPress={this.goLogIn}>
                                <Text style={styles.textWhiteLogin}>{'Login to a better life'.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    
                        <View style={{width:"100%"}}>
                            <Text style={{top:12,fontSize: 16, fontFamily: 'System', color: '#ffffff', textAlign: 'center', ...statementFontStyle }}>In a hurry?</Text>
                            <TouchableOpacity style={styles.takeAssessmentBtn} onPress={this.goCheckYourWellness}>
                                <Text style={styles.textCheckYourWellness}>{'Check Your Wellness Now'.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            </View>
        )
    }


    goRegister = () => {
        this.props.updateCurrentFlow("NEW");
        this.props.navigation.navigate('Register');
    }
    goLogIn = () => {
        this.props.updateCurrentFlow("NEW");
        this.props.navigation.navigate('LogIn');
    }
    goCheckYourWellness = () => {
        this.props.updateCurrentFlow("NEW");
        this.props.navigation.navigate('CheckYourWellness');
    }
    selectAssessment = () => {
        let questions = [];
        let question = {};
        fetch(BASE_URL + '/api/theme/question?themeCode=WSMN', {
            method: 'GET',
            headers
        }).then((response) => response.json())
            .then((responseJson) => {
                questions = responseJson;
                question = responseJson[0];
                for (let i = 0; i < questions.length; i++) {
                    questions[i].selectedIndex = null;
                    for (let j = 0; j < questions[i].options.length; j++) {
                        questions[i].options[j].checked = false;
                    }
                }
                this.props.setAssessmentType("Wholesomeness");
                this.props.getAllQuestion(questions);
                this.props.getCurrentQuestion(question);
            })
            .catch((error) => {
                console.error(error);
            });
        this.props.setAssessmentType("Wholesomeness");
        this.props.updateCurrentFlow("UNREGISTERED");
        this.props.navigation.navigate("AssessmentInfo", { title: "Wholesomeness" });
    }
}


const statementFontStyle = fontMaker({family: 'Montserrat', weight: 'Regular'});
const logoTextFontStyle = fontMaker({family: 'OpenSans', weight: 'Bold'});
const styles = StyleSheet.create({
    loginContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    loginInnerContainer: {
        backgroundColor: '#00000054',
        position: 'absolute',
        top: 20,
        bottom: 20,
        left: 10,
        right: 10,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-around'
    },
    statement: {
        fontSize: 25,
        color: '#ffffff',
        textAlign: 'center',
        paddingHorizontal: 10,
        ...statementFontStyle
    },
    textCheckYourWellness: {
        color: '#ffffff',
        fontSize: 15,
        ...regularButtonFont
    },
    textWhiteLogin: {
        color: '#ffffff',
        fontSize: 18,
        ...regularButtonFont
    },
    takeAssessmentBtn: {
        backgroundColor: '#80399d',
        marginHorizontal: 20,
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 15,
        borderRadius: 8,
        marginLeft: 30,
        marginRight: 30,
    },
    registerBtn: {
        backgroundColor: '#2980b9',
        alignItems: 'center',
        paddingVertical: 12,
        width: 130,
        borderRadius: 8,
        marginLeft: 5
    },
    logInBtn: {
        backgroundColor: '#27ae60',
        marginHorizontal: 20,
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 30,
        borderRadius: 8,
        marginLeft: 30,
        marginRight: 30,
        height:60,
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center'
    },
    loginLogo: {
        marginTop: 40,
        marginBottom: 5
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default connect(null, mapDispatchToProps)(LandingComponent);