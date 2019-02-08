import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, BackHandler, ActivityIndicator,Image } from 'react-native';
import { Container, Content, Header, Left, Body, Title, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { updateAssessmentReport } from '../../store/actions/report';
import OverallScore from '../assessmentReport/OverallScore';
import GetAssessmentReportService from '../../api/assessment/AssessmentReportService';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import { BarIndicator } from 'react-native-indicators';

const mapStateToProps = state => ({
    assessmentId: state.Assessment.assessmentId,
    currentAssessment: state.Assessment.currentAssessment
})

const mapDispatchToProps = dispatch => ({
    getReport: (data) => dispatch(updateAssessmentReport(data)),
})

class MinimumReport extends React.Component {

    state = {
        score: 40.35,
        peerScore: 45.67,
        observations: [],
        spinner: true
    };
    componentDidMount() {
        let id = this.props.assessmentId;
        GetAssessmentReportService.fetchAssessmentReport(id)
            .then((responseJson) => {
                try {
                    this.setState({
                        score: responseJson.finalScore,
                    });
                    // setTimeout(() => {
                    this.setState({ spinner: false })
                    // }, 2000);
                }
                catch (ex) {
                    console.error(ex);
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }


    render() {
        if (this.state.spinner) {
            return (
                <Container>
                    {<Header style={{ backgroundColor: 'white' }} >
                        <Body marginLeft={5}>
                            <Title style={{ justifyContent: 'center', alignContent: "center", alignItems: "center", color: '#144E76',...reportTitleFontStyle }}> {this.props.currentAssessment} Report </Title>
                        </Body>
                    </Header>}
                    <View style={styles.sliderContainer}>
                        <Image style={styles.loginLogo} source={require('../../assets/images/onboard/zulNew.png')} />
                    </View>
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
                        <Title style={{justifyContent: 'center', alignContent: "center", alignItems: "center", color: '#144E76',...reportTitleFontStyle }}> {this.props.currentAssessment} Report </Title>
                    </Body>
                    </Header>
                    <Content style={{ backgroundColor: '#f7f7f7' }}>
                        <OverallScore value={this.state.score} />
                        <View style={{ padding: 10 }}>
                            <TouchableOpacity style={styles.HomeBtn} onPress={() => this.props.navigation.navigate('Register')}>
                                <Text style={styles.whiteText}>{"Sign Up to get full report".toUpperCase()}</Text>
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
        backgroundColor: '#41ab3e',
        marginHorizontal: 10,
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
        borderRadius: 8,
        marginLeft: 40,
        marginRight: 40
    },
    whiteText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    sliderContainer: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginLogo: {
        marginTop: 10,
        marginBottom: 20
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(MinimumReport)