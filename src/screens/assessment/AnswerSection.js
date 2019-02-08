
import React, { Component } from 'react';
import { Animated, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { connect } from 'react-redux';
import FadeInView from '../../assets/animations/FadeInView';
import { CheckBox } from 'react-native-elements'
import { Button } from 'native-base';
import { updateCurrentQuestion, updateQuestions, isNextQuestionLoading, updateAssessmentId, updateCurrentAnswerId } from '../../store/actions/index';
import { themeCode } from '../../components/utility/assessment/themeCodes';
import { BASE_URL, headers } from '../../api/config/Config';
import moment from 'moment';
import { fontMaker, regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';


const windowObj = Dimensions.get('window');
const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  questions: state.Assessment.questions,
  assessmentId: state.Assessment.assessmentId,
  currentFlow: state.Assessment.currentFlow,
  userName: state.User.name,
  currentAssessment: state.Assessment.currentAssessment,
  dob: state.User.dob,
  currentAnswerId: state.Assessment.currentAnswerId
})

const mapDispatchToProps = dispatch => ({
  goToQuestion: (question) => dispatch(updateCurrentQuestion(question)),
  getAllQuestion: (questions) => dispatch(updateQuestions(questions)),
  loadingNextQuestion: (isLoading) => dispatch(isNextQuestionLoading(isLoading)),
  updateAssessmentId: (id) => dispatch(updateAssessmentId(id)),
  updateCurrentAnswerId: (id) => dispatch(updateCurrentAnswerId(id)),
  addReward: (reward) => dispatch({
    type: 'RewardReducer_AddReward',
    payload: reward
  }),
  congratulate: (value) => dispatch({
    type: 'RewardReducer_Congratulate',
    payload: value
  }),
  openRewardModal: (value) => dispatch({
    type: 'RewardReducer_RewardModalVisible',
    payload: value
  })
})

class AnswerSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionAnswer: this.props.currentQuestion.options.slice(0, this.optionIndex),
      checkFadeIn: null,
      //checkMoreOptionsBtn: this.renderMoreOptionsButton(this.props.currentQuestion.no - 1),
      //checkLessOptionsBtn: null,
      fadeAnimation: new Animated.Value(0),
      showAlert: false,
      MoreOptions: true,
      sclAlert: false,
      showSCLAlert: false,

      alertTitle: "",
    };
  }

  //optionIndex = 4;
  totalOptions = this.props.currentQuestion.options.length;


  componentWillMount() {
    if (this.props.currentAnswerId)
      this.setState((prevState, currentProps) => {
        return {
          checkFadeIn: this.renderButton(this.props.currentQuestion.no - 1)
        }
      })
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

  getAnsweredQuestions = (data, drafted = "completed") => {
    let answeredQuestions = [];
    for (let i = 0; i < data.length; i++) {
      var answerObj = {};
      var q = data[i];
      answerObj.ansType = q.ansType;
      answerObj.questionId = q._id;
      answerObj.answers = [];
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
            if (this.props.currentFlow === 'REGISTERED') {
              this.props.goToReport();
            } else {
              this.props.goToMinReport();
            }
          } else {
            this.setState({ alertTitle: 'Error!, Response is null/undefined or _id is not present' });
            this.handleOpen()
          }
        } else {
          this.setState({ alertTitle: 'Error!, Response is null/undefined' });
          this.handleOpen()
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  selectAnswer = (index) => {
    this.props.questions[this.props.currentQuestion.no - 1].selectedIndex = index;
    this.props.getAllQuestion(this.props.questions);
    let questionIndex = this.props.currentQuestion.no;
    if (questionIndex !== this.props.questions.length) {
      if (this.props.currentQuestion.no >= this.props.questions.length) {
        questionIndex--;
      }
      setTimeout(() => {
        this.props.loadingNextQuestion(true);
        setTimeout(() => {
          this.props.goToQuestion(this.props.questions[questionIndex]);
          this.props.loadingNextQuestion(false);
        }, 200)
      }, 500)
    } else {
      this.setState({ sclAlert: true });
    }
  }

  uncheckBoxes = () => {

    for (let item of this.state.optionAnswer) {
      if (!item.nonOfTheseOption && item.checked) {
        item.checked = !item.checked;
      }
    }
  }

  selectCheckBox = (index) => {

    this.state.optionAnswer[index].checked = !this.state.optionAnswer[index].checked;
    const optionSelected = this.state.optionAnswer[index];
    this.setState((prevState, currentProps) => {
      return {
        optionAnswer: prevState.optionAnswer,
        checkFadeIn: null,
        //checkMoreOptionsBtn: null,
        //checkLessOptionsBtn: null
      };
    });


    if (optionSelected.checked && optionSelected.nonOfTheseOption) {
      this.uncheckBoxes();
    }
    else {
      for (let item of this.state.optionAnswer) {
        if (item.nonOfTheseOption) {
          item.checked = false;
        }
      }
    }

    this.setState((prevState, currentProps) => {
      return { optionAnswer: prevState.optionAnswer };
    });

    for (let item of this.state.optionAnswer) {
      if (item.checked) {
        this.setState((prevState, currentProps) => {
          return {
            checkFadeIn: this.renderButton(this.props.currentQuestion.no - 1),
            //checkMoreOptionsBtn: (prevState.MoreOptions) ? this.renderMoreOptionsButton(this.props.currentQuestion.no - 1) : null,
            //checkLessOptionsBtn: (!prevState.MoreOptions) ? this.renderLessOptionsButton(this.props.currentQuestion.no - 1) : null
          };
        });
      }
    }
  }




  //To Display more CheckBox options on Click of More Options button
  // showMoreOptions = (index) => {
  //   for (let i = index; i < this.totalOptions; i++) {
  //     this.state.optionAnswer.push(this.props.currentQuestion.options[i]);
  //   }
  //   this.setState((prevState, currentProps) => {
  //     return {
  //       optionAnswer: prevState.optionAnswer,
  //       MoreOptions: false,
  //       checkMoreOptionsBtn: null,
  //       checkLessOptionsBtn: this.renderLessOptionsButton(this.props.currentQuestion.no - 1)
  //     };
  //   });
  // }

  //To Display only first four options on click of Less Options button
  // showLessOptions() {
  //   this.state.optionAnswer = this.props.currentQuestion.options.slice(0, this.optionIndex),
  //     this.setState((prevState, currentProps) => {
  //       return {
  //         optionAnswer: prevState.optionAnswer,
  //         MoreOptions: false,
  //         checkLessOptionsBtn: null,
  //         checkMoreOptionsBtn: this.renderMoreOptionsButton(this.props.currentQuestion.no - 1)
  //       };
  //     });
  // }

  //To Render the Next Button
  renderButton = (index) => {
    const nextBtn = (this.totalOptions <= 4) ?
      <TouchableOpacity style={styles.nextButtonCenter} onPress={() => this.selectAnswer(index)}>
        <Text style={styles.whiteText}>{"Next".toUpperCase()}</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity style={styles.nextButton} onPress={() => this.selectAnswer(index)}>
        <Text style={styles.whiteText}>{"Next".toUpperCase()}</Text>
      </TouchableOpacity>
    return nextBtn;
  }

  //To Render More Options Button
  // renderMoreOptionsButton = (index) => {
  //   return <TouchableOpacity style={styles.moreButton} onPress={() => this.showMoreOptions(this.optionIndex)}>
  //     <Text style={styles.whiteText}>{"More Options".toUpperCase()}</Text>
  //   </TouchableOpacity>
  // }

  //To render Less Options Button
  // renderLessOptionsButton = (index) => {
  //   return <Button onPress={() => this.showLessOptions(index)} style={styles.lessOptionsBtn}>
  //     <Text style={{ color: 'white', fontWeight: 'bold' }}>{"Less Options".toUpperCase()}</Text>
  //   </Button>
  // }

  handleSclClose = () => {
    this.getReport(this.props.questions, "completed");
    this.setState({ sclAlert: false });
  }
  handleSclDismiss = () => {
    this.setState({ sclAlert: false });
  }

  handleOpen = () => {
    this.setState({ showSCLAlert: true })
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
  }

  render() {
    return (
      <ScrollView>
        <SCLAlert
          theme="success"
          show={this.state.sclAlert}
          title={"Thank you!"}
          subtitle={'Your personalized report is now ready.'}
          cancellable={true}
          onRequestClose={this.handleSclDismiss}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="success" onPress={this.handleSclClose} textStyle={{ ...regularButtonFont }}>Get Your Report</SCLAlertButton>
        </SCLAlert>
        <SCLAlert
          theme="danger"
          show={this.state.showSCLAlert}
          title={'Oops!'}
          subtitle={this.state.alertTitle}
          cancellable={true}
          onRequestClose={this.handleClose}
          headerContainerStyles={{ backgroundColor: '#41ab3e' }}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="danger" onPress={this.handleClose}>Close</SCLAlertButton>
        </SCLAlert>
        {this.totalOptions > 4 && this.props.currentQuestion.ansType === 'multiple' ? <Text style={{ color: '#b71c1c', textAlign: 'right', paddingRight: 12, ...noteFontStyle }}>This question contains multiple options</Text> : null}
        < View style={styles.optionView} >
          {
            (this.props.currentQuestion.ansType === 'single') ?
              <RadioGroup
                size={24}
                thickness={2}
                color='#bfbfbf'
                highlightColor='#f5f5f5'
                activeColor="#41ab3e"
                selectedIndex={this.props.currentQuestion.selectedIndex}
                onSelect={(index, value) => this.selectAnswer(index)}
              >
                {this.props.currentQuestion.options.map((x, i) => (
                  <RadioButton style={styles.radio} key={i} value={x.weightage} >
                    <FadeInView duration={500} delay={i * 100 + 200}>
                      <Text style={styles.labeltext}>{x.label}</Text>
                    </FadeInView>
                  </RadioButton>
                ))}
              </RadioGroup>
              :
              this.state.optionAnswer.map((x, i) => (
                <View style={styles.checkbox}>
                  <CheckBox
                    key={i}
                    title={x.label}
                    checked={x.checked}
                    onPress={() => this.selectCheckBox(i)}
                    containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                    checkedColor='#41ab3e'
                    size={35}
                    textStyle={{ fontSize: 14, color: '#070f15', fontWeight: 'normal', ...answerFontStyle, flex: 1 }}
                  />
                </View>

              ))
          }

          {/* If there are more than 4 check options, we need More Options &  Next button*/}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            {/* {(this.state.MoreOptions && this.totalOptions > 5) ?
              this.state.checkMoreOptionsBtn : this.state.checkLessOptionsBtn
            } */}
            {(this.props.currentQuestion.ansType === 'multiple' && this.totalOptions > 4) ?
              this.state.checkFadeIn : null
            }
          </View>

          {/* If there are only 4 check options, we need only next button*/}
          {
            (this.props.currentQuestion.ansType === 'multiple' && this.totalOptions <= 4) ?
              this.state.checkFadeIn : null
          }
        </View >
      </ScrollView >
    );
  }
}

const noteFontStyle = fontMaker({ family: 'OpenSans', weight: 'Light' });
const answerFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const answerCardStyle = {
  //elevation: 1,
  borderWidth: .15,
  backgroundColor: 'white',
  borderRadius: 5,
  borderColor: 'transparent'
};
const styles = StyleSheet.create({
  optionView: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  radio: {
    padding: 18,
    marginVertical: 5,
    margin: 2,
    ...answerCardStyle
  },
  checkbox: {
    padding: 3,
    marginVertical: 5,
    margin: 2,
    ...answerCardStyle
  },
  labeltext: {
    ...answerFontStyle,
    fontSize: 16,
    marginLeft: 10,
    color: '#070f15'
  },
  moreButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    width: 150,
  },
  lessOptionsBtn: {
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    width: 150,
  },
  nextButton: {
    backgroundColor: '#2980b9',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 10,
    width: 100,
  },
  nextButtonCenter: {
    backgroundColor: '#2980b9',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 10,
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AnswerSection);


