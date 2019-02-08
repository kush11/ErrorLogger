import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,PickerIOS
} from 'react-native';
import { updateWeight, updateBmi } from '../../store/actions/index'
import Picker from 'react-native-wheel-picker'
import { connect } from 'react-redux';
import { BASE_URL, headers } from '../../api/config/Config';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { regularButtonFont, fontMaker } from '../../components/utility/fonts/FontMaker';

var PickerItemIOS = PickerIOS.Item;

const mapStateToProps = state => ({
    name: state.User.name,
    uHeight: state.User.height,
    uWeight: state.User.weight,
})
const mapDispatchToProps = dispatch => ({

    updateWeight: (weight) => dispatch(updateWeight(weight)),
    updateBmi: (bmi) => dispatch(updateBmi(bmi))
})
var PickerItem = Picker.Item;
class WeightChange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: this.props.uWeight === '' ? 0 : this.props.uWeight,
            itemList: []

        };
        let c = 0;
        for (var i = 0; i <= 634; i++) {
            this.state.itemList[c++] = i
        }

    }
    onPickerSelect(index) {
        this.setState({
            selectedItem: index,
        })
    }
    error=()=>{
        
        this.gfsdg();
    }
    onAddItem = () => {
        fetch(BASE_URL + '/api/userData', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: this.props.name,
                weight: this.state.itemList[this.state.selectedItem]
            })
        }).then((response) => response.json(),
            this.props.updateWeight(this.state.itemList[this.state.selectedItem]))
            .then(this.props.updateBmi(CalculateBmi(this.props.uHeight, this.state.itemList[this.state.selectedItem])))
            .then(this.props.navigation.navigate("PersonalSetting"))
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Change Weight
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
                    <Picker style={styles.picker}
                        selectedValue={this.state.selectedItem}
                        itemStyle={{ color: "black", fontSize: 26 }}
                        onValueChange={(index) => this.onPickerSelect(index)}>
                        {this.state.itemList.map((value, i) => (
                            <PickerItem label={value.toString()} value={i} key={"number" + value.toString()} />
                        ))}
                    </Picker>
                }

                <Text  style={{
                    margin: 20, color: '#000000', fontSize: 20, justifyContent: 'center',marginTop:30,
                    alignItems: 'center',
                    alignSelf: 'center',...titleFontStyle
                }}>
                    Selected : {this.state.itemList[this.state.selectedItem]} kg
                </Text>

                <TouchableOpacity style={styles.setBmiBtn} onPress={this.onAddItem}>
                    <Text style={styles.textWhite}>{'Set Weight'.toUpperCase()}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.setBmiBtn} onPress={this.error}>
                    <Text style={styles.textWhite}>{'Set Error'.toUpperCase()}</Text>
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
        //backgroundColor: '#f7f8f9',
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
    picker: {
        width: "100%",
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: rgb(220, 220, 220),
        marginTop: 20
    },
    text: {
        margin: 20,
        color: '#000000',
        fontSize: 25,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
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
export default connect(mapStateToProps, mapDispatchToProps)(WeightChange);
