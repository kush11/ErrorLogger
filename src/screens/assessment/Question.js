import React, { Component } from 'react';
import { Text, View } from 'react-native';
import QuestionSection from './QuestionSection';
import AnswerSection from './AnswerSection';
import FooterSection from './FooterSection';
import QuestionHeader from './QuestionHeader';

import { connect } from 'react-redux';
import { Header, Footer, FooterTab, Left, Right, Body, Button, Container, Content } from 'native-base';


const mapStateToProps = state => ({
    currentQuestion: state.Assessment.currentQuestion,
    isNextQuestionLoading: state.Assessment.isNextQuestionLoading
})



class Question extends Component {

    render() {
        const currentQuestion = this.props.currentQuestion;
        return (
            <Container>
                <QuestionHeader currentQuestion={currentQuestion} />

                <View style={{ flex: 2 }}>
                    <QuestionSection />
                </View>
                <View style={{ flex: 3 }}>
                    {!this.props.isNextQuestionLoading && <AnswerSection goToSignUp={this.props.goToSignUp} goToReport={this.props.goToReport} goToMinReport={this.props.goToMinReport}/>}
                </View>
                <View>
                    <FooterSection quitAssessment={this.props.quitAssessment} goToDashboard={this.props.goToDashboard} />
                </View>

            </Container>
        );
    }
}

export default connect(mapStateToProps)(Question);
