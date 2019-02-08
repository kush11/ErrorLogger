import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, BackHandler, ActivityIndicator, Image } from 'react-native';
import { Container, Content, Header, Left, Body, Title, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import OverallScore from '../assessmentReport/OverallScore';
import OverallPeerScore from '../assessmentReport/OverallPeerScore';
import Observations from '../assessmentReport/Observations';
import ActionPlan from '../assessmentReport/ActionPlan';
import Icons from 'react-native-vector-icons/Ionicons'
import { BASE_URL } from '../../api/config/Config';
import { updateAssessmentReport } from '../../store/actions/report';
import { updateCurrentFlow } from '../../store/actions/assessment';
import GetAssessmentReportService from '../../api/assessment/AssessmentReportService';
import { fontMaker, regularButtonFont } from '../../components/utility/fonts/FontMaker';
import { BarIndicator } from 'react-native-indicators';

const mapStateToProps = state => ({
    assessmentId: state.Assessment.assessmentId,
    currentAssessment: state.Assessment.currentAssessment
})

const mapDispatchToProps = dispatch => ({
    getReport: (data) => dispatch(updateAssessmentReport(data)),
    updateCurrentFlow: (data) => dispatch(updateCurrentFlow(data)),

})

class AssessmentReport extends React.Component {
    constructor(props) {
        super(props);
        this.backHandle = this._backHandle.bind(this);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandle)
        );
    }

    state = {
        score: 40.35,
        peerScore: 45.67,
        observations: [],
        goalsSuggestion: [],
        spinner: true,
        isModalVisible: false
    };

    _backHandle = () => {
        this.props.navigation.navigate('Overview')
        return true;
    }

    componentDidMount() {
        let id = this.props.assessmentId;
        GetAssessmentReportService.fetchAssessmentReport(id)
            .then((responseJson) => {
                try {
                    this.setState({
                        score: responseJson.finalScore,
                        peerScore: responseJson.peerScore
                    });
                    let observations = [];
                    let lowObservations = [];
                    let highObservations = [];
                    for (let obs of responseJson.themeReportData) {
                        if (obs.score === "Low") {
                            obs.type = "danger";
                            for (let label of obs.keywords) {

                                lowObservations.push({
                                    text: label.label,
                                    type: obs.type
                                });
                            }
                        } else {
                            obs.type = "normal";
                            for (let label of obs.keywords) {

                                highObservations.push({
                                    text: label.label,
                                    type: obs.type
                                });
                            }
                        }
                      
                    }
                    observations.push(...highObservations);
                    observations.push(...lowObservations);
                    this.setState({
                        observations: observations
                    });
                    this.setState({
                        goalsSuggestion: responseJson.goalsSuggestion
                    })
                    this.setState({ spinner: false })
                } catch (ex) {
                    console.error(ex);
                }
            })
            .catch((error) => {
                console.error(error);
            });

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
        );
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);

    }
    goToDashboard = () => {

        this.props.updateCurrentFlow("REGISTERED");
        this.props.navigation.navigate('Overview');
    }

    toggleModal = () => {
        this.setState((prevState, currentProps) => {
            return { isModalVisible: !prevState.isModalVisible };
        });
    }

    render() {

        if (this.state.spinner) {
            return (
                <Container>
                    {<Header style={{ backgroundColor: 'white' }} >
                        <Body marginLeft={5}>
                            <Title style={{ justifyContent: 'center', alignContent: "center", alignItems: "center", color: '#144E76', ...reportTitleFontStyle }}> {this.props.currentAssessment} Report </Title>
                        </Body>
                    </Header>}
                    <View style={{ backgroundColor: 'transparent', position: 'absolute', top: 55, bottom: 0, left: 0, right: 0 }}>
                        <BarIndicator color="#41ab3e" style={{ marginTop: "0%" }} count={5}/>
                    </View>
                </Container>)
        }
        else {
            return (
                <Container style={styles.container}>
                    <Header style={{ backgroundColor: 'white' }}>
                        <Body marginLeft={5}>
                            <Title style={{ justifyContent: 'center', alignContent: "center", alignItems: "center", color: '#144E76', ...reportTitleFontStyle }}> {this.props.currentAssessment} Report </Title>
                        </Body>
                    </Header>
                    <Content style={{ backgroundColor: '#f7f7f7' }}>
                        <OverallScore value={this.state.score} />
                        <OverallPeerScore value={this.state.peerScore} toggleModal={this.toggleModal} modalVisible={this.state.isModalVisible} />
                        <Observations observations={this.state.observations} />
                        <ActionPlan goalsSuggestion={this.state.goalsSuggestion} />
                        {/*<ExpertSuggestions /> */}
                        {/* <NavigationSection /> */}
                        <View style={{ padding: 10 }}>
                            <TouchableOpacity style={styles.HomeBtn} onPress={this.goToDashboard}>
                                <Text style={styles.whiteText}>{"Wellness Home".toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </Container>
            )
        }
    }

}

const reportTitleFontStyle = fontMaker({family: 'OpenSans', weight: 'SemiBold'});
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    HomeBtn: {
        backgroundColor: '#2980b9',
        marginHorizontal: 10,
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        borderRadius: 8,
        marginLeft: 60,
        marginRight: 60
    },
    whiteText: {
        color: 'white',
        ...regularButtonFont
    },
    loginLogo: {
        marginTop: 10,
        marginBottom: 20
    }, 
    sliderContainer: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(AssessmentReport)