import React, { Component } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";
import { getLabel } from "../../components/utility/locale/I18N";
import { Toast } from 'native-base';

import ReportQuestionService from "../../api/assessment/ReportQuestionService";

import { connect } from 'react-redux';

const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  isNextQuestionLoading: state.Assessment.isNextQuestionLoading,
  questions: state.Assessment.questions,
  user: state.User.name
})

class ReportAssessmentDialog extends Component {
  state = {
    dialogVisible: this.props.visible,
    feedback: '',
  };

  showDialog = () => {
    this.props.showReportQuestionDialog();

  };

  handleCancel = () => {
    this.props.hideReportQuestionDialog();
    this.setState({ feedback: "" });
  };

  handleSend = () => {
    // send logic
    let requestObject = {
      questionId: this.props.currentQuestion._id,
      feedback: this.state.feedback,
      user: this.props.user ? this.props.user : 'guest'
    }
    let isFeedbackEmpty = false;
    try {
      if (this.state.feedback === "") {
        Toast.show({
          text: "Please provide some details on feedback",
          duration: 2000,
          type: 'default'
        });
        isFeedbackEmpty = true;
        return;
      }

      ReportQuestionService.fetchFeedback(requestObject)
        .then((responseJson) => {
          if (responseJson !== null && responseJson !== 'undefined') {
            if (responseJson._id) {
              Toast.show({
                text: "Feedback submitted successfully",
                duration: 2000,
                type: 'default'
              });

            } else {
              Alert.alert('Something Went Wrong!', 'Response is null/undefined or _id is not present');
            }
          } else {
            Alert.alert('Something Went Wrong!', 'Response is null/undefined');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    finally {
      if (!isFeedbackEmpty)
        this.props.hideReportQuestionDialog();

      this.setState({ feedback: "" });

    }

  };

  render() {
    return (
      <Dialog.Container visible={this.props.visible} >
        <Dialog.Title style={styles.titleStyle}>
          {getLabel("assessment.feedbackTitle")}
        </Dialog.Title>
        <Dialog.Description style={styles.descStyle}>
          {getLabel("assessment.feedbackDescription")}
        </Dialog.Description>

        <Dialog.Input
          multiline={true}
          style={{ paddingHorizontal: 20 }}
          maxLength={100}
          placeholder={'Write here'}
          onChangeText={(feedback) => this.setState({ feedback })}
          value={this.state.feedback}>
        </Dialog.Input>
        <Dialog.Button label={getLabel("assessment.feedbackCancelButton")} onPress={this.handleCancel} />
        <Dialog.Button label={getLabel("assessment.feedbackSendButton")} onPress={this.handleSend} />
      </Dialog.Container>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "black",
    alignSelf: 'center'
  },
  descStyle: {
    color: "black"
  }
})

export default connect(mapStateToProps)(ReportAssessmentDialog)