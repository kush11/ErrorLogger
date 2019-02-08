import React, { Component } from 'react';
import { Platform, View, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions, Keyboard, ImageBackground, ScrollView, Switch } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Badge, Card, List, ListItem, Footer } from 'native-base';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL, headers } from '../../api/config/Config';

import { setAssessmentType, updateQuestions, updateCurrentQuestion, updateCurrentFlow } from '../../store/actions/index';

import GetAssessmentInfoService from '../../api/assessment/AssessmentInfoService'
import { themeCode } from '../../components/utility/assessment/themeCodes';
const windowDimensions = Dimensions.get("window");
import { NoFlickerImage } from 'react-native-no-flicker-image'
import WallpaperAnimation from '../../assets/animations/WallpaperAnimation';



const mapStateToProps = state => ({
    currentAssessment: state.Assessment.currentAssessment,
    uName: state.User.name
})
const mapDispatchToProps = dispatch => ({
    getAllQuestion: (data) => dispatch(updateQuestions(data)),
    getCurrentQuestion: (data) => dispatch(updateCurrentQuestion(data)),
    setAssessmentType: (type) => dispatch(setAssessmentType(type)),
    updateCurrentFlow: (type) => dispatch(updateCurrentFlow(type)),
})


class CheckYourWellness extends Component {
    selectAssessment = (data) => {
        let questions = [];
        let question = {};
        let requestUrl = BASE_URL + '/api/theme/question?themeCode=' + themeCode(data);
        fetch(requestUrl, {
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
                this.props.setAssessmentType(data);
                this.props.getAllQuestion(questions);
                this.props.getCurrentQuestion(question);
            })
            .catch((error) => {
                console.error(error);
            });
        this.props.setAssessmentType(data);
        this.props.updateCurrentFlow("UNREGISTERED");
        this.props.navigation.navigate("AssessmentInfo", { title: data });
    }

    render() {
        const list = [
            { 'label': 'Biological Age', 'time': '2 min to complete', 'img': { uri: 'https://zulimageapi.herokuapp.com/image/A10022-min.jpg' }, 'title': "Biological Age" },
            { 'label': 'Diet & Score', 'time': '1 min to complete', 'img': { uri: 'https://zulimageapi.herokuapp.com/image/A10020-min.jpg' }, 'title': "Diet Score" },
            { 'label': 'Wholesomeness', 'time': '2 min to complete', 'img': { uri: 'https://zulimageapi.herokuapp.com/image/A10033-min.jpg' }, 'title': "Wholesomeness" },
        ]
        const icons = ['calendar', 'food', 'human-handsup']
        const colors = [['#41D387', '#12BCEB'], ['#F29B3C', '#F66FD8'], ['#E9214C', '#D78CE7']];
        return (
            <ScrollView style={styles.container} >
                <ImageBackground resizeMode="cover" style={{ height: windowDimensions.height, width: windowDimensions.width }}>
                    <View style={styles.blackMatLayer}>
                        {list.map((Names, i) => (
                            <TouchableOpacity style={styles.box} key={i} onPress={({ Name = Names.title }) => { this.selectAssessmen(Name) }}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={colors[i]} style={[styles.left]}>
                                    <View style={styles.iconContainer}>
                                        <Icon name={icons[i]} size={80} color="#fff" />
                                    </View>
                                </LinearGradient>
                                <View style={styles.right}>
                                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'center' }}>
                                        <View style={{ flexDirection: 'column' }} >
                                            <Text style={styles.text}>{Names.label}</Text>
                                            <View style={{ flexDirection: "row", alignSelf: 'flex-start', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flexDirection: "column" }}><Icon name="alarm-check" size={16} color={'#144E76'} /></View>
                                                <View style={{ marginLeft: 10, flexDirection: "column" }}><Text style={{ fontSize: 12 }} >{Names.time}</Text></View>
                                            </View>
                                        </View>

                                    </View>
                                </View>


                            </TouchableOpacity>
                        ))}

                    </View>
                </ImageBackground>
            </ScrollView>


        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    box: {
        height: "20%",
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: "row",
        marginTop: 30,
        elevation: 5,
        borderWidth: .15,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        ...Platform.select({
            ios: {
                borderColor: 'transparent',
                shadowOffset: { width: 4, height: 4 },
                shadowColor: '#90a4ae',
                shadowOpacity: 5.0
            }
        })
    },
    left: {
        width: "40%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        height: "102%",
        marginRight: 10
    },
    left0: {
        backgroundColor: '#ce93d8'
    },
    left1: {
        backgroundColor: '#ffe082'
    },
    left2: {
        backgroundColor: '#80deea'
    },
    right: {
        flex: 1,
        flexDirection: "row",
    },
    rightTop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    rightBottom: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    imagesrc: {
        height: 110,
        width: 110,
        borderRadius: 55
    },
    text: {
        fontSize: 18,
        color: "#144E76"
    },
    blackMatLayer: {
        flex: 1,
        position: 'absolute',
        top: 20,
        bottom: 20,
        left: 10,
        right: 10
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(CheckYourWellness);