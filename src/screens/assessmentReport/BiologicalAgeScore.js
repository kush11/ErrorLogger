import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import { fontMaker, defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({

})
const BiologicalAgeScore = (props) => {
    let score = { value: props.value };
    let title = props.title;
    return (
        <View>
            <SCLAlert
                theme="info"
                show={props.modalVisible}
                title={props.title}
                subtitle=""
                cancellable={true}
                onRequestClose={props.toggleModal}
                titleStyle={{...defaultModalFont}}
                subtitleStyle={{...defaultModalFont}}
            >
                <View style={styles.container}>
                    <Text numberOfLines={5} style={styles.subtitle}>
                        Biological age is a person's level of biological development and physical health.
                    </Text>
                </View>
                <SCLAlertButton theme="info" onPress={props.toggleModal} textStyle={{...regularButtonFont}}
>Close</SCLAlertButton>
            </SCLAlert>

            <View>
                <Text style={styles.title}>{title.toUpperCase()}</Text>
            </View>
            <View style={{ backgroundColor: '#ffffff', padding: 10, flexDirection: 'row' }}>
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
                                    <Text style={{ fontSize: 25, textAlign: 'center', color: '#3a3a3a',...scoreFontStyle }}
                                        accessible={true}
                                        accessibilityLabel="Biological Score"
                                        accessibilityHint="Biological Score of taken assessment">
                                        {`${score.value}`}
                                    </Text>
                                    <Text style={{ fontSize: 25, color: '#3a3a3a' }}>
                                        {/* {score.caption} */}
                                    </Text>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={props.toggleModal}>
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
    },
    logInBtn: {
        backgroundColor: '#41ab3e',
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 10,
        borderRadius: 8,
        marginRight: 40,
        marginLeft: 40,

    },
    modal: {
        paddingVertical: 180,
        width: 350,
        alignSelf: 'center'
    },
    whiteText: {
        color: '#ffffff',
        fontSize: 15
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: "#555555",
        fontWeight: '300'
    }

})
export default connect(mapStateToProps)(BiologicalAgeScore);