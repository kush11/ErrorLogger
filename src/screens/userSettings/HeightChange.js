import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity, PickerIOS
} from 'react-native';
import { connect } from 'react-redux';
import Picker from 'react-native-wheel-picker'
import { updateHeight, updateBmi } from '../../store/actions/index'
import { BASE_URL, headers } from '../../api/config/Config';
import CalculateBmi from '../../components/utility/bmi/Bmi'
import { regularButtonFont, fontMaker} from '../../components/utility/fonts/FontMaker'


var PickerItemIOS = PickerIOS.Item;


const mapStateToProps = state => ({
    name: state.User.name,
    uHeight: state.User.height,
    uWeight: state.User.weight,
})
const mapDispatchToProps = dispatch => ({
    updateHeight: (height) => dispatch(updateHeight(height)),
    updateBmi: (bmi) => dispatch(updateBmi(bmi))
})
var PickerItem = Picker.Item;

class HeightChange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: this.props.uHeight === '' ? 0 : this.props.uHeight,
            itemList: []

        };
        let c = 0;
        for (var i = 0; i <= 300; i++) {
            this.state.itemList[c++] = i
        }

    }

    onPickerSelect(index) {
        this.setState({
            selectedItem: index,
        })
    }
    onAddItem = () => {
        fetch(BASE_URL + '/api/userData', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: this.props.name,
                height: this.state.itemList[this.state.selectedItem]
            })
        }).then((response) => response.json(),
            this.props.updateHeight(this.state.itemList[this.state.selectedItem]))
            .then(this.props.updateBmi(CalculateBmi(this.state.itemList[this.state.selectedItem], this.props.uWeight)))
            .then(this.props.navigation.navigate("PersonalSetting"))
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Please select
                </Text>

            {Platform.OS === 'ios' ?   
            <PickerIOS
            style={{ marginTop: 20, alignSelf: 'center', width: "100%", height: 180, backgroundColor: rgb(220, 220, 220), width: 300, height: 215 }}
            selectedValue={this.state.selectedItem}
            itemStyle={{ color: "black", fontSize: 26 }}
            onValueChange={(index) => this.onPickerSelect(index)}>
            {this.state.itemList.map((value, i) => (
                <PickerItemIOS
                    key={"number" + value.toString()}
                    value={i}
                    label={value.toString()}
                />
            ))}
        </PickerIOS>
        :
                 <Picker style={{
                    width: "100%", height: 180, justifyContent: 'center',
                    alignItems: 'center', backgroundColor: '#eee', marginTop: 20
                }}
                    selectedValue={this.state.selectedItem}
                    itemStyle={{ color: "black", fontSize: 26 }}
                    onValueChange={(index) => this.onPickerSelect(index)}>
                    {this.state.itemList.map((value, i) => (
                        <PickerItem label={value.toString()} value={i} key={"number" + value.toString()} />
                    ))}
                </Picker> 
            
                
            }
                <Text style={{
                    margin: 20, color: '#000000', fontSize: 20, justifyContent: 'center',marginTop:30,
                    alignItems: 'center',
                    alignSelf: 'center',...titleFontStyle
                }}>
                    Selected : {this.state.itemList[this.state.selectedItem]} cm
                </Text>
                <TouchableOpacity style={styles.setBmiBtn} onPress={this.onAddItem}>
                    <Text style={styles.textWhite}>{'Set Height'.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const titleFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#f9f9f9',
        backgroundColor: 'white'
    },
    setBmiBtn: {
        backgroundColor: '#41ab3e',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 60,
        marginLeft: 60

    },
    textWhite: {
        color: '#ffffff',
        fontSize: 15,
        ...regularButtonFont
    },
    welcome: {
        fontSize: 16,
        textAlign: 'center',
        marginTop:15,
        color: 'black',
        ...titleFontStyle
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(HeightChange);