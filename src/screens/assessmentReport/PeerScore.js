import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
    score: state.Report.assessmentReport.score
})
const mapDispatchToProps = dispatch => ({

})
const OverallScore = (props) => {
    let score = { value: props.value };
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>{'Overall Score'.toUpperCase()}</Text>
            </View>
            <View style={{ backgroundColor: '#ffffff', padding: 10 }}>
                <View style={{ flex: 7, marginLeft: 50, marginTop: 10 }}>
                    <AnimatedCircularProgress style={{ alignSelf: 'center',
                      borderColor: 'transparent',
                      shadowOffset: { width: 4, height: 4 },
                      shadowColor: '#90a4ae',
                      shadowOpacity: 5.0 }}
                        size={180}
                        width={15}
                        fill={score.value}
                        tintColor="#41ab3e"
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#ddd">
                        {
                            (fill) => (
                                <View>
                                    <Text style={{ fontSize: 25, textAlign: 'center', color: '#3a3a3a', ...scoreFontStyle }}>
                                        {`${score.value}%`}
                                    </Text>
                                    <Text style={{ fontSize: 25, color: '#3a3a3a' }}>
                                        {/* {score.caption} */}
                                    </Text>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
                <View style={{ flex:1}}>
                    <TouchableOpacity>
                        <Icon name="info" size={25} color="#2980b9" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const titleFontStyle = fontMaker({family: 'OpenSans', weight: 'SemiBold'});
const scoreFontStyle = fontMaker({family: 'Montserrat', weight: 'Regular'});
const styles = StyleSheet.create({
    title: {
        color: '#495057',
        fontSize: 15,
        padding: 10,
        ...titleFontStyle
    }
})
export default connect(mapStateToProps)(OverallScore);