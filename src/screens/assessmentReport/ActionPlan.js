import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Thumbnail, List, ListItem, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { fontMaker } from '../../components/utility/fonts/FontMaker';


const ActionPlan = (props) => {
    return (
        props.goalsSuggestion &&props.goalsSuggestion.length>0 ?
        <View>
            <Text style={styles.title}>{'Suggested Goals'.toUpperCase()}</Text>
            <View style={{ flexWrap: 'wrap', alignItems: 'flex-start', flexDirection: 'row', backgroundColor: '#ffffff', padding: 10 }}>
                {props.goalsSuggestion.map((x, i) => (
                    <Text style={[styles.tag, { color: '#00b386' }]} key={i}>{x.description}</Text>
                ))}
            </View>
        </View>:
        <View>
        </View>
    )
}

const titleFontStyle = fontMaker({family: 'OpenSans', weight: 'SemiBold'});
const tagsFontStyle = fontMaker({family: 'Montserrat', weight: 'Regular'});
const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 2,
        marginRight: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        fontSize:14,
        ...tagsFontStyle
    },
    title: {
        color: '#495057',
        fontSize: 15,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        ...titleFontStyle
    }
})

export default ActionPlan;