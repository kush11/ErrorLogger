import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Badge } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { Header, Footer, FooterTab, Left, Right, Body, Button, Container, Content } from 'native-base';

const mapStateToProps = state => ({
    currentAssessment: state.Assessment.currentAssessment,
    totalReward: 0
})

class QuestionHeader extends React.Component {
    render() {
        return (
            <View>
                {(Platform.OS === 'ios') ?
                    <Header style={{ backgroundColor: 'white' }} >
                        <Left>
                            <Text style={styles.headerIos}>{this.props.currentAssessment}</Text>
                        </Left>
                        <Right>
                            {/* <Text style={{ fontWeight: 'bold', color: 'black' }}>
                                <Icon name="trophy" style={{ marginRight: 5 }} size={20} />
                                <Text>{this.props.totalReward}</Text>
                            </Text> */}
                        </Right>
                    </Header> :
                    <Header style={{ backgroundColor: 'white' }} >
                        <Left>
                            <Text style={styles.header}>{this.props.currentAssessment}</Text>
                        </Left>
                        <Right>
                            {/* <Text style={{ fontWeight: 'bold', color: 'black' }}>
                                <Icon name="trophy" style={{ marginRight: 5 }} size={20} />
                                <Text>{this.props.totalReward}</Text>
                            </Text> */}
                        </Right>
                    </Header>
                }
            </View>
        )
    }
}

export default connect(mapStateToProps)(QuestionHeader);

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 350,
        color: '#144E76'
    },
    headerIos: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 350,
        color: '#144E76'
    },
})