import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import AppRoute from '../../navigation/Route';
import { Root } from 'native-base';


class ZingUpLife extends Component {
    render() {
        return (
            <View style={{ flex: 1, paddingTop: (Platform.OS === 'ios') ? 18 : 0}}>
                <Root>
                    <AppRoute />
                </Root>
            </View>
        );
    }
}

export default ZingUpLife;


