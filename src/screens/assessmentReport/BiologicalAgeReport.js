import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, BackHandler, ActivityIndicator } from 'react-native';
import { Container, Content, Header, Left, Body, Title, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import BiologicalAge from '../assessmentReport/BiologicalAgeScore';
import CalendarAge from '../assessmentReport/CalendarAgeScore';
import { BASE_URL, headers } from '../../api/config/Config';
import { updateAssessmentReport } from '../../store/actions/report';
import { updateCurrentFlow } from '../../store/actions/assessment';
import GetAssessmentReportService from '../../api/assessment/AssessmentReportService'
import { fontMaker, regularButtonFont } from '../../components/utility/fonts/FontMaker';
import { BarIndicator } from 'react-native-indicators';

const mapStateToProps = state => ({
    assessmentId: state.Assessment.assessmentId,
    currentAssessment: state.Assessment.currentAssessment
})

const mapDispatchToProps = dispatch => ({
    updateCurrentFlow: (data) => dispatch(updateCurrentFlow(data)),
})

class BiologicalAgeReport extends React.Component {
    constructor(props) {
        super(props);
        this.backHandle = this._backHandle.bind(this);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.backHandle)
        );
    }

    state = {
        biologicalAge: 36,
        calendarAge: 27,
        spinner: false,
        modalVisibleBio: false,
        modalVisibleCal: false,
    };

    _backHandle = () => {
        this.props.navigation.navigate('AssessmentList')
        return true
    }

    componentDidMount() {
        let id = this.props.assessmentId;
        GetAssessmentReportService.fetchAssessmentReport(id)
            .then((responseJson) => {
                try {
                    if (responseJson) {
                        this.setState({
                            biologicalAge: responseJson.biologicalAge,
                            calendarAge: responseJson.calendarAge
                        });
                        this.setState({ spinner: false })
                    }
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

    toggleModalBio = () => {
        this.setState((prevState, currentProps) => {
            return { modalVisibleBio: !prevState.modalVisibleBio };
        });
    }

    toggleModalCal = () => {
        this.setState((prevState, currentProps) => {
            return { modalVisibleCal: !prevState.modalVisibleCal };
        });
    }

    render() {

        if (this.state.spinner) {
            return (
                <Container>
                    <Header style={{ backgroundColor: 'white' }}>
                    <Body marginLeft={5}>
                        <Title style={{ justifyContent: 'center', alignContent: "center", alignItems: "center", color: '#144E76',...reportTitleFontStyle }}> Biological Age Report </Title>
                    </Body>
                    </Header>
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
                    <Header style={{ backgroundColor: 'white' }} >
                    <Body marginLeft={5}>
                        <Title style={{ justifyContent: 'center', alignContent: "center", alignItems: "center", color: '#144E76',...reportTitleFontStyle  }}> Biological Age Report </Title>
                    </Body>
                    </Header>
                    <Content style={{ backgroundColor: '#f7f7f7' }}>
                        <BiologicalAge value={this.state.biologicalAge} title={'Biological Age'} toggleModal={this.toggleModalBio} modalVisible={this.state.modalVisibleBio} />
                        <CalendarAge value={this.state.calendarAge} title={'Calendar Age'} toggleModal={this.toggleModalCal} modalVisible={this.state.modalVisibleCal} />
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
        marginLeft: 70,
        marginRight: 70
    },
    whiteText: {
        color: '#fff',
        ...regularButtonFont
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
export default connect(mapStateToProps, mapDispatchToProps)(BiologicalAgeReport)