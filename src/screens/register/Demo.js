import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import { Text, Button } from 'native-base';
import {BASE_URL,headers} from '../../api/config/Config';
export default class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'email',
            name: 'name',
        };
    };

    makeCall = () => {
        fetch(BASE_URL + '/api/user', {
            method: 'GET',
            headers
        })
            .then((response) => response.json()) 
            .then((responseJson) => {
                this.setState({
                    name: responseJson[0].name,
                    email: responseJson[0].email
                });
            })
    }
    render() {
        return (
            <View style={{ flex: 1, padding: 20 }}>
                <View>
                    <Text>{this.state.name}</Text>
                    <Text>{this.state.email}</Text>
                </View>
                <Button onPress={this.makeCall}><Text>Get</Text></Button>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        margin: 5
    }
});
