import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default class LoginFooter extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.registerBtn} onPress={this.goRegister}>
                    <Text style={styles.textWhite}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        )
    }

    takeAssessment = () => {
        this.props.takeAssessment();
    }

    goRegister = () => {
        this.props.goRegister();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 3
    },
    takeAssessmentBtn: {
        backgroundColor: '#80399d',
        margin: 5,
        alignItems: 'center',
        padding: 10
    },
    registerBtn:{
        backgroundColor: '#2980b9',
        margin: 5,
        alignItems: 'center',
        padding: 10
    },
    statement: {
        margin: 5,
        fontSize:15,
        color:'#ffffff',
        textAlign:'center'
    },
    orStatement:{
        fontSize:15,
        color:'#ffffff',
        textAlign:'center'
    },
    textWhite:{
        color:'#ffffff'
    }
})