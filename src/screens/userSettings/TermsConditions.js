import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions, Keyboard, ImageBackground, ScrollView, Switch } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Badge, Card, List, ListItem, Footer } from 'native-base';
import {fontMaker} from '../../components/utility/fonts/FontMaker';

class TermsConditions extends Component {
    state = {
        
    };
    
    render() {
    
        return (
            <View>
                <List>
                    {/* <ListItem>

                        <Left>
                            <View style={styles.list}>
                                <View><Text style={styles.listText}>Touch Id</Text></View>

                            </View>
                        </Left>


                        <Body>

                        </Body>
                        <Right style={{alignContent:'center'}}>
                            <View>
                                {authModeSelectionSection}
                            </View>

                        </Right>
                    </ListItem> */}
                </List>
            </View>
        )
    }
}

const termsFontStyle = fontMaker({family: 'OpenSans', weight: 'Regular'});
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flexDirection: 'row',
    },
    listText: {
        fontSize: 18,
        textAlign: "center",
        color: 'black',
        ...termsFontStyle
    },
})
export default TermsConditions