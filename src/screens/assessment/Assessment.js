import React, { Component } from 'react';
import { Text, View, Image, Button, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Question from './Question';
import { exitAssessment, updateCurrentQuestion, updateQuestions, updateAssessmentId, updateCurrentFlow } from '../../store/actions/index';
import { BASE_URL } from '../../api/config/Config';


const mapStateToProps = state => ({
    currentQuestion: state.Assessment.currentQuestion,
    questions: state.Assessment.questions,
    isNextQuestionLoading: state.Assessment.isNextQuestionLoading,
    currentAssessment: state.Assessment.currentAssessment,
    currentFlow: state.Assessment.currentFlow,
    assessmentId: state.Assessment.assessmentId,
    uName: state.User.name
})

const mapDispatchToProps = dispatch => ({
    goToQuestion: (question) => dispatch(updateCurrentQuestion(question)),
    getAllQuestion: (questions) => dispatch(updateQuestions(questions)),
    getCurrentQuestion: (question) => dispatch(updateCurrentQuestion(question)),
    exitAssessment: (data) => dispatch(exitAssessment(data)),
    updateCurrentFlow: (flow) => dispatch(updateCurrentFlow(flow))

})

class Assessment extends Component {

    constructor(props) {
        super(props);
        this.exitHandle = this._exitHandle.bind(this);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.exitHandle)
        );
    }

    onSwipe(gestureName, gestureState) {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                break;
            case SWIPE_DOWN:
                break;
            case SWIPE_LEFT:
                if (this.props.currentQuestion.no < this.props.questions.length) {
                    this.props.goToQuestion(this.props.questions[this.props.currentQuestion.no]);
                }
                break;
            case SWIPE_RIGHT:
                if (this.props.currentQuestion.no > 1) {
                    this.props.goToQuestion(this.props.questions[this.props.currentQuestion.no - 2]);
                }
                break;
        }
    }
    exitAlert = () => {
        return (
            Alert.alert(
                'Quit Assessment',
                'Do you want to quit the assessment?',
                [
                    { text: 'No', onPress: () => console.log('Cancel Pressed') },
                    {
                        text: 'Yes', onPress: () => this.goToStart()
                    },
                ],
                { cancelable: false }
            )

        )
    };
    _exitHandle = () => {
        this.exitAlert()
        return true
    }
    componentDidMount() {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.exitHandle)
        );
    }
    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.exitHandle);

    }

    goToDashboard = () => {
        this.props.navigation.navigate('Overview');
    }
    quitAssessment = () => {
        if (this.props.uName === '' || this.props.uName === null)
            this.props.navigation.navigate('StartPage');
        else
            this.props.navigation.navigate('AssessmentList');
    }
    goToStart = () => {
        if (this.props.uName === '' || this.props.uName === null)
            this.props.navigation.navigate('StartPage');
        else
            this.props.navigation.navigate('AssessmentList');
    }

    goToSignUp = () => {
        this.props.navigation.navigate('Register');
    }
    goToReport = () => {
        if (this.props.currentAssessment === 'Biological Age')
            this.props.navigation.navigate('BiologicalReport');
        else
            this.props.navigation.navigate('AssessmentReport');
    }
    goToMinReport = () => {
        if (this.props.currentAssessment === 'Biological Age')
            this.props.navigation.navigate('Register');
        else
            this.props.navigation.navigate('MinimunReport');
    }
    render() {
        return (
            <Question onDismiss={this.onDismiss} quitAssessment={this.quitAssessment} goToSignUp={this.goToSignUp} goToReport={this.goToReport} goToDashboard={this.goToDashboard} goToMinReport={this.goToMinReport} />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Assessment)
