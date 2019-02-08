import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Image, ScrollView, Button } from 'react-native';
import { List, Text, ListItem, Left, Body, Thumbnail, Right } from 'native-base';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import {
    updateCurrentAssessment, setAssessmentType, updateQuestions, updateCurrentQuestion,
    updateAssessmentId, updateCurrentAnswerId
} from '../../store/actions/assessment';
import moment from 'moment'
import { updateAssessmentsList } from '../../store/actions/assessmentList';
import { getLabel } from '../../components/utility/locale/I18N';
import { themeCode } from '../../components/utility/assessment/themeCodes';
import GetAssessmentListService from '../../api/assessment/GetAssessmentListService';
import { BASE_URL, headers } from '../../api/config/Config';
import BottomZulTabs from '../../components/ui/navigation/BottomZulTabs';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
    currentAssessment: state.Assessment.currentAssessment,
    assessmentsList: state.AssessmentList.assessmentsList,
    userName: state.User.name,
    uDob: state.User.dob
})
const mapDispatchToProps = dispatch => ({
    setAssessmentType: (data) => dispatch(setAssessmentType(data)),
    updateAssessmentsList: (data) => dispatch(updateAssessmentsList(data)),
    getAllQuestion: (data) => dispatch(updateQuestions(data)),
    getCurrentQuestion: (data) => dispatch(updateCurrentQuestion(data)),
    updateAssessmentId: (data) => dispatch(updateAssessmentId(data)),
    updateCurrentAnswerId: (data) => dispatch(updateCurrentAnswerId(data)),
    updateCurrentAssessment: (data) => dispatch(updateCurrentAssessment(data)),
    updateDob: (data) => dispatch(updateDob(data))

})

const listItemFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const reportButtonFontStyle = fontMaker({ family: 'Montserrat', weight: 'Bold' });
const noteFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        marginTop: 5
    },
    logoutBtn: {
        backgroundColor: '#2980b9',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 120,
        marginRight: 120,
        marginBottom: 10,
    },
    whiteText: {
        color: '#fff'
    },


});

{/* from x.drafted === "notdrafted" backgroundColor: '#73a4f53b',*/ }
const Page = ({ assessments, selectReport, selectAssessment, selectDraftedAssessment }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={{ backgroundColor: '#ffffff' }}>
                <List>
                    {assessments.map((x, i) => (
                        x.drafted === "completed" ?
                            <ListItem noIndent thumbnail key={i} onPress={() => { selectReport(x.title, x.id) }} style={{ paddingVertical: 5 }}>
                                <Left>
                                    <Thumbnail source={x.icon} />
                                </Left>
                                <Body>
                                    <Text style={{ color: '#3a3a3a', ...listItemFontStyle }}>{x.title}</Text>
                                    <Text note style={{ ...noteFontStyle }}>{x.note}</Text>
                                </Body>
                                <Right>
                                    <TouchableOpacity onPress={() => selectReport(x.title, x.id)}>
                                        <Text style={{ fontSize: 12, ...reportButtonFontStyle }}
                                            accessible={true}
                                            accessibilityLabel="View Report"
                                            accessibilityHint="View Assesssment report">{'View Report'}</Text>
                                    </TouchableOpacity>
                                </Right>
                            </ListItem> : x.drafted === "notdrafted" ?
                                <ListItem noIndent thumbnail key={i} onPress={() => selectAssessment(x.title)} style={{ paddingVertical: 5 }}>
                                    <Left>
                                        <Thumbnail source={x.icon} />
                                    </Left>
                                    <Body>
                                        <Text style={{ color: '#3a3a3a', ...listItemFontStyle }}>{x.title}</Text>
                                        <Text style={{ color: '#b71c1c', ...noteFontStyle }} note>{x.note}</Text>
                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={() => selectAssessment(x.title)}>
                                            <Icon name="arrow-right" />
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem> :
                                <ListItem noIndent thumbnail key={i} onPress={() => selectDraftedAssessment(x.title, x.id)} style={{ paddingVertical: 5 }}>
                                    <Left>
                                        <Thumbnail source={x.icon} />
                                    </Left>
                                    <Body>
                                        <Text style={{ color: '#3a3a3a', ...listItemFontStyle }}>{x.title}</Text>
                                        <Text style={{ color: '#b71c1c', ...noteFontStyle }} note>Saved for later</Text>
                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={() => selectDraftedAssessment(x.title, x.id)}>
                                            <Icon name="arrow-right" />
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem>
                    ))}
                </List>
            </View>
        </ScrollView>
    )
};

const Tab = ({ tab, page, isTabActive, onPressHandler, onTabLayout, styles }) => {
    const { label, icon } = tab;
    const style = {
        marginHorizontal: 20,
        paddingVertical: 10,
    };
    const containerStyle = {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: styles.backgroundColor,
        opacity: styles.opacity,
        transform: [{ scale: styles.opacity }],
    };
    const textStyle = {
        color: styles.textColor,
        fontWeight: '600',
    };
    return (
        <TouchableOpacity style={style} onPress={onPressHandler} onLayout={onTabLayout} key={page}>
            <Animated.View style={containerStyle}>
                <Animated.Text style={textStyle}>{label}</Animated.Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

class AssessmentList extends Component {
    _scrollX = new Animated.Value(0);
    // 6 is a quantity of tabs
    interpolators = Array.from({ length: 9 }, (_, i) => i).map(idx => ({
        scale: this._scrollX.interpolate({
            inputRange: [idx - 1, idx, idx + 1],
            outputRange: [1, 1.2, 1],
            extrapolate: 'clamp',
        }),
        opacity: this._scrollX.interpolate({
            inputRange: [idx - 1, idx, idx + 1],
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        }),
        textColor: this._scrollX.interpolate({
            inputRange: [idx - 1, idx, idx + 1],
            outputRange: ['#3a3a3a', '#fff', '#3a3a3a'],
        }),
        backgroundColor: this._scrollX.interpolate({
            inputRange: [idx - 1, idx, idx + 1],
            outputRange: ['#fff', '#3f51b5', '#fff'],
            extrapolate: 'clamp',
        }),
    }));
    constructor(props) {
        super(props);
        this.state = {
            dobText: '',
            dobDate: null,
        };

    };
    toggleModal = () => {
        this.setState((prevState, currentProps) => {
            return { modalVisible: !prevState.modalVisible };
        });
    }

    logout = () => {
        this.props.navigation.navigate("LogIn");
    }

    selectReport = (title, id) => {
        this.props.updateAssessmentId(id);
        this.props.updateCurrentAssessment(title)
        if (title === 'Biological Age')
            this.props.navigation.navigate('BiologicalReport');
        else
            this.props.navigation.navigate("AssessmentReport", { title: title });
    }

    componentWillMount() {
        let reqData = { userName: this.props.userName };
        let assessmentsList = [];
        /* FETCH CALL TO GET ALL THE ASSESSMENTS */
        GetAssessmentListService.fetchAssessmentList(reqData)
            .then((responseJson) => {
                assessmentsList = responseJson;
                for (let i = 0; i < assessmentsList.length; i++) {
                    switch (assessmentsList[i].title) {
                        case 'Wholesomeness':
                            assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/A10033-min.jpg' }
                            break;
                        case 'Diet Score':
                            assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/A10020-min.jpg' }
                            break;
                        case 'Thought Control':
                            assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/A10019-min.jpg' }
                            break;
                        case 'Zest For Life':
                            assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/A10026-min.jpg' }
                            break;
                        case 'Strength & Energy':
                            assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/shutterstock_574800841-nw.jpg' }
                            break;
                        case 'Relationship & Intimacy':
                            assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/A10023-min.jpg' }
                            break;
                        case 'Biological Age':
                            assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/A10022-min.jpg' }
                            break;

                    }
                }
                this.props.updateAssessmentsList(assessmentsList);
            })
            .catch((error) => {
                console.error(error);
            });
    }



    render() {
        const logoutText = getLabel("home.logout");
        return (
            <View style={[styles.container]}>
                {/* <ScrollableTabView
                    renderTabBar={() => (
                        <TabBar
                            underlineColor="#3f51b5"
                            tabBarStyle={{ backgroundColor: "#fff", borderTopColor: '#d2d2d2', borderTopWidth: 1 }}
                            renderTab={(tab, page, isTabActive, onPressHandler, onTabLayout) => (
                                <Tab
                                    key={page}
                                    tab={tab}
                                    page={page}
                                    isTabActive={isTabActive}
                                    onPressHandler={onPressHandler}
                                    onTabLayout={onTabLayout}
                                    styles={this.interpolators[page]}
                                />
                            )}
                        />
                    )}
                    onScroll={(x) => this._scrollX.setValue(x)}>
                    <Page tabLabel={{ label: "All" }} selectDraftedAssessment={this.selectDraftedAssessment} selectAssessment={this.selectAssessment} selectReport={this.selectReport} assessments={this.props.assessmentsList} />
                    <Page tabLabel={{ label: "Physical" }} pressHandler={this.selectAssessment} assessments={[]} />
                    <Page tabLabel={{ label: "Emotional" }} pressHandler={this.selectAssessment} assessments={[]} />
                    <Page tabLabel={{ label: "Spiritual" }} pressHandler={this.selectAssessment} assessments={[]} />
                    <Page tabLabel={{ label: "Environmental" }} pressHandler={this.selectAssessment} assessments={[]} />
                    <Page tabLabel={{ label: "Financial" }} pressHandler={this.selectAssessment} assessments={[]} />
                    <Page tabLabel={{ label: "Social" }} pressHandler={this.selectAssessment} assessments={[]} />
                    <Page tabLabel={{ label: "Intellectual" }} pressHandler={this.selectAssessment} assessments={[]} />
                    <Page tabLabel={{ label: "Occupational" }} pressHandler={this.selectAssessment} assessments={[]} />
                </ScrollableTabView> */}
                <Page tabLabel={{ label: "All" }} selectDraftedAssessment={this.selectDraftedAssessment} selectAssessment={this.selectAssessment} selectReport={this.selectReport} assessments={this.props.assessmentsList} />
                <BottomZulTabs navigator={this.props.navigation} activeTab={'checks'} />
            </View>
        )
    }


    selectAssessment = (data) => {
        this.props.updateCurrentAnswerId(null);
        this.props.setAssessmentType(data);
        let requestUrl = BASE_URL + '/api/theme/question?themeCode=' + themeCode(data);
        let questions = [];
        let question = {};
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
                this.props.getAllQuestion(questions);
                this.props.getCurrentQuestion(question);
                this.props.updateCurrentAnswerId(null);
                this.props.navigation.navigate("AssessmentInfo", { title: data });
            })
            .catch((error) => {
                console.error(error);
            });

    }


    selectDraftedAssessment = (data, id) => {
        this.props.updateCurrentAnswerId(null);
        let reqObject = { id: id };
        fetch(BASE_URL + "/api/getAnswer", {
            method: 'POST',
            headers,
            body: JSON.stringify(reqObject)
        }).then((response_option) => response_option.json())
            .then((responseJson_option) => {
                let optionAray = responseJson_option[0];
                this.props.setAssessmentType(data);
                let requestUrl = BASE_URL + '/api/theme/question?themeCode=' + themeCode(data);
                let questions = [];
                let question = {};
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

                        for (let i = 0; i < optionAray.options.length; i++) {

                            //selected questions
                            question = questions[i];
                            if (!optionAray.options[i].answers.length) {
                                break;
                            }
                            //Mapping old questions
                            for (let j = 0; j < optionAray.options[i].answers.length; j++) {
                                questions[i].selectedIndex = optionAray.options[i].answers[j].answerIndex - 1;
                                if (optionAray.options[i].answers[j].ansType === "single") {
                                    continue
                                }
                                for (let k = 0; k < questions[i].options.length; k++) {
                                    if (questions[i].options[k].checked) {
                                        continue;
                                    }
                                    questions[i].options[k].checked = questions[i].options[k].label === optionAray.options[i].answers[j].answerDescription;
                                }
                            }



                        }
                        this.props.getAllQuestion(questions);
                        this.props.getCurrentQuestion(question);
                        this.props.updateCurrentAnswerId(id);
                        this.props.navigation.navigate("Assessment", { title: data });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AssessmentList)
