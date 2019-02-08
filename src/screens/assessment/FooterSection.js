import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { ActionSheet, Root } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import TutorialModal from './TutorialModal';
import { updateCurrentQuestion, isNextQuestionLoading, updateAssessmentId, updateCurrentAnswerId } from '../../store/actions/index';
import ReportAssessmentDialog from "../assessment/ReportQuestion";
import { themeCode } from '../../components/utility/assessment/themeCodes';
import { BASE_URL, headers } from '../../api/config/Config';
import moment from 'moment';
var BUTTONS = [
    { text: "Give feedback on this question", icon: "flag" },
    { text: "Quit the assessment", icon: "md-exit" },
    { text: "Cancel", icon: "close" }
];

var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 3;

const mapStateToProps = state => ({
    currentQuestion: state.Assessment.currentQuestion,
    questions: state.Assessment.questions,
    currentFlow: state.Assessment.currentFlow,
    userName: state.User.name,
    currentAssessment: state.Assessment.currentAssessment,
    dob: state.User.dob,
    currentAnswerId: state.Assessment.currentAnswerId
})

const mapDispatchToProps = dispatch => ({
    goToQuestion: (question) => dispatch(updateCurrentQuestion(question)),
    loadingNextQuestion: (isLoading) => dispatch(isNextQuestionLoading(isLoading)),
    updateAssessmentId: (id) => dispatch(updateAssessmentId(id)),
    updateCurrentAnswerId: (id) => dispatch(updateCurrentAnswerId(id)),
    openTutorialModal: () => dispatch({
        type: 'TutorialReducer_TutorialVisible',
        payload: true
    }),
    closeCommentModal: () => dispatch({
        type: 'CommentReducer_ShowComment',
        payload: true
    })
})


class FooterSection extends React.Component {
    constructor() {
        super();
        this.state = {
            iconColor: '#000000',
            reportQuestionVisible: false
        }


    }
    componentDidMount() {
        //TODO: Remove the condition once the save for letter from unregirested id is implemented
        console.log("currentFlow: " + this.props.currentFlow)
        if (this.props.currentFlow === 'REGISTERED') {
            BUTTONS = [
                { text: "Save for later", icon: "bookmark" },
                { text: "Give feedback on this question", icon: "flag" },
                { text: "Quit the assessment", icon: "md-exit" },
                { text: "Cancel", icon: "close" }
            ];
            DESTRUCTIVE_INDEX = 3;
            CANCEL_INDEX = 4;
        }
        else {
            BUTTONS = [
                { text: "Give feedback on this question", icon: "flag" },
                { text: "Quit the assessment", icon: "md-exit" },
                { text: "Cancel", icon: "close" }
            ];
        }
    }


    iconClickHandler = () => {
        this.setState((prevState, currentProps) => {
            return { iconColor: prevState.iconColor === '#000000' ? '#ff0000' : '#000000' };
        });
    }
    goToNextQuestion = () => {
        setTimeout(() => {
            this.props.loadingNextQuestion(true);
            setTimeout(() => {
                this.props.goToQuestion(this.props.questions[this.props.currentQuestion.no]);
                this.props.loadingNextQuestion(false);
            }, 200)
        }, 500)
    }
    showReportQuestionDialog = () => {
        this.setState({
            reportQuestionVisible: true
        });
    }
    hideReportQuestionDialog = () => {
        this.setState({
            reportQuestionVisible: false
        });
    }

    getAnsweredQuestions = (data, drafted = "completed") => {
        let answeredQuestions = [];
        for (let i = 0; i < data.length; i++) {
            var answerObj = {};
            var q = data[i];
            answerObj.ansType = q.ansType;
            answerObj.questionId = q._id;
            answerObj.answers = [];
            try {
                if (q.ansType === 'multiple') {
                    let checkedOptions = q.options.filter((option) => { return option.checked });
                    for (let j = 0; j < checkedOptions.length; j++) {
                        var multipleOptionObj = {};
                        multipleOptionObj.answerDescription = checkedOptions[j].label;
                        multipleOptionObj.answerIndex = checkedOptions[j].no;
                        multipleOptionObj.weightage = checkedOptions[j].weightage;
                        multipleOptionObj.answerScore = checkedOptions[j].answerScore;
                        //Pushing the Object to options List
                        answerObj.answers.push(multipleOptionObj);
                    }
                } else if (q.ansType === 'single') {
                    var singleOptionObj = {};
                    singleOptionObj.answerDescription = q.options[q.selectedIndex].label;
                    singleOptionObj.answerIndex = q.options[q.selectedIndex].no;
                    singleOptionObj.weightage = q.options[q.selectedIndex].weightage;
                    singleOptionObj.answerScore = q.options[q.selectedIndex].answerScore;
                    //Pushing the Object to options List
                    answerObj.answers.push(singleOptionObj);
                }
            } catch (ex) {

            }
            answeredQuestions.push(answerObj);
        }
        let obj = {
            _id: this.props.currentAnswerId,
            answerId: null,
            userName: this.props.userName,
            theme: this.props.currentAssessment,
            date: this.getCurrentDate(),
            options: answeredQuestions,
            themeCode: themeCode(this.props.currentAssessment),
            drafted: drafted,
            dob: this.props.dob ? moment(this.props.dob).format('MM-DD-YYYY') : null
        };
        return obj;
    }
    getCurrentDate = () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }
    //TODO: move redundant methods of footer section and answer section in single utility
    getReport = (data, drafted) => {
        let reqData = this.getAnsweredQuestions(data, drafted);
        fetch(BASE_URL + '/api/answer', {
            method: 'POST',
            headers,
            body: JSON.stringify(reqData)
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson !== null && responseJson !== 'undefined') {
                    if (responseJson.id !== null) {
                        this.props.updateAssessmentId(responseJson.id);
                        this.props.updateCurrentAnswerId(null);
                        this.props.goToDashboard();
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {
        return (

            <View style={styles.container}>
                <View style={styles.comment}>
                    <TouchableOpacity style={styles.btn}>
                        <Text></Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.btn} onPress={() =>
                        ActionSheet.show(
                            {
                                options: BUTTONS,
                                cancelButtonIndex: CANCEL_INDEX,
                                destructiveButtonIndex: DESTRUCTIVE_INDEX,

                            },
                            buttonIndex => {
                                if (buttonIndex < CANCEL_INDEX) {
                                    this.setState({ clicked: BUTTONS[buttonIndex] });
                                    if (BUTTONS[buttonIndex].text === 'Quit the assessment') {
                                        Alert.alert(
                                            'Quit Assessment',
                                            'Do you want to quit the assessment?',
                                            [
                                                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                                { text: 'Yes', onPress: () => this.props.quitAssessment() },
                                            ],
                                            { cancelable: false }
                                        )
                                    }
                                    else if (BUTTONS[buttonIndex].text === 'Give feedback on this question') {
                                        this.setState({
                                            reportQuestionVisible: true
                                        });
                                    }
                                    else if (BUTTONS[buttonIndex].text === 'Save for later') {
                                        Alert.alert(
                                            'Save Assessment',
                                            'Do you want to save the assessment and submit it later?',
                                            [

                                                {
                                                    text: 'Yes', onPress: () => {
                                                        this.getReport(this.props.questions, "drafted");
                                                    }
                                                },
                                            ],
                                            { cancelable: true }
                                        )
                                    }
                                }
                            }
                        )}>
                        <Icon name="ellipsis-v" size={25} color="#000000" />
                    </TouchableOpacity>
                </View>
                <TutorialModal />
                <ReportAssessmentDialog visible={this.state.reportQuestionVisible} showReportQuestionDialog={this.showReportQuestionDialog} hideReportQuestionDialog={this.hideReportQuestionDialog} />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterSection)


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 5,
        borderColor: '#ddd',
        borderTopWidth: 1
    },
    comment: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    btn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5
    }
})