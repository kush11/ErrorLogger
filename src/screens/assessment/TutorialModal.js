import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, Image, View, Dimensions, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Icon, List, ListItem, Body, Right, Left, Thumbnail, Badge } from 'native-base';
const mapStateToProps = state => ({
    isTutorialVisible: false,
    currentQuestion: state.Assessment.currentQuestion
})

const mapDispatchToProps = dispatch => ({
    closeTutorialModal: () => dispatch({
        type: 'TutorialReducer_TutorialVisible',
        payload: false
    })
})
const windowObj = Dimensions.get('window');
const screenwidth = windowObj.width;
const screenheight = windowObj.height / 5;
const infowidth = windowObj.width * 9 / 10;
const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

class TutorialModal extends Component {
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.isTutorialVisible}
                onRequestClose={() => {

                }}>
                <View style={styles.tutorialModal} enforceFocus={false}>
                    <View style={styles.tutorial}>
                        <View style={styles.modalHeader}>
                            <Left>
                                <Badge style={{ backgroundColor: '#7B68EE', left: 4 }}>
                                    <Text style={{ color: 'white', top: 2, fontWeight: 'bold' }}>1129 Views</Text>
                                </Badge>
                            </Left>
                            <Text style={{ width: 100, fontSize: 16, height: 30, right: 80, top: 10, fontWeight: 'bold' }} >Details</Text>
                            <TouchableHighlight
                                style={styles.closeBtn}
                                onPress={this.props.closeTutorialModal}>
                                <Icon name="times-circle" type="FontAwesome" size={25} />
                            </TouchableHighlight>
                        </View>
                        <View style={styles.modalBody}>
                            <ImageBackground source={require('../../assets/images/health-image.png')} style={{ right: 5, width: screenwidth, height: screenheight, alignSelf: 'center' }} resizeMode="cover">
                                <View style={styles.questionView}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 24, padding: 5, color: 'white' }}>What do you do on a daily basis to ensure that you stay healthy?</Text>
                                </View>
                            </ImageBackground>
                            <List>
                                <ListItem avatar>
                                    <Body>
                                        <Text style={{ width: infowidth - 30 }}><B>Description: </B>
                                            Many of us search the world to find those that can help us achieve the health that we desire and  yet very few of us realize the ability to achieve health awaits us in our own back yard. Last month Pure Core Nourishment ran a workshop for our clients about how our own subconscious inbuilt programming can impact our health. And without question, the results for everyone who attended were phenomenal. Most of us do not realize that our ingrained Core Beliefs about who and what we are are formed in the first 5 years of life. These first five years are entirely controlled by our subconscious which controls development and reasoning and of course can be attested to by any parent.</Text>
                                    </Body>
                                </ListItem>
                                <ListItem avatar>
                                    <Body style={{ flexDirection: 'row' }}>
                                        <Text>
                                            <B>Suggested By: </B>WHO
                                    </Text>
                                        <Image style={{ width: 30, height: 30, left: 15, bottom: 5 }} source={require('../../assets/images/WHO.jpg')}></Image>
                                    </Body>
                                </ListItem>
                            </List>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    tutorialModal: {
        padding: 10,
        flex: 1,
        backgroundColor: '#00000066'
    },
    tutorial: {
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: 10
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    modalBody: {
        flex: 1
    },
    questionView: {
        margin: 30,
        backgroundColor: '#00000066',
        flex: 1,
        padding: 3,
        flexDirection: 'column',
        height: 50
    },
    closeBtn: {
        padding: 5,
        margin: 3
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(TutorialModal);