import React, { Component } from 'react';
import TouchID from 'react-native-touch-id';
import { StyleSheet, Keyboard,View,Image,TouchableOpacity,Alert } from 'react-native';
import {Toast} from 'native-base';
import { connect } from 'react-redux';
import { updateUsername } from '../../../store/actions/users';
import { updateCurrentFlow } from '../../../store/actions/assessment';
import {getLoggedInUserName} from '../../../repository/login/LoginRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mapDispatchToProps = dispatch => ({
  updateUsername: (name) => dispatch(updateUsername(name)),
  updateCurrentFlow: (flow) => dispatch(updateCurrentFlow(flow))
})

class TouchComponent extends Component {
  componentDidMount(){
    if(this.props.askByDefault){
      this._pressHandler();
    }
  }
render(){
    return(
        <View style={styles.touchIdStyle}>
              <TouchableOpacity onPress={this._pressHandler}>
                {/* <Image style={styles.imgStyle} source={require('../../../assets/images/loginwallpapers/touchIdWhite.png')} /> */}
                <Icon name="fingerprint" size={50} color="#fff"/>
              </TouchableOpacity>
        </View>
    );
}
_pressHandler=()=> {
    TouchID.authenticate('Touch Id or Enter Passcode',undefined)
      .then(success => {
         getLoggedInUserName().then((value) => {
          this.props.updateUsername(value);
          this.props.updateCurrentFlow("REGISTERED");
          this.props.goHome();
       
    });
        
      })
      .catch(error => {
           if(error==="LAErrorTouchIDNotAvailable"){
          Toast.show({
             text: "Touch Id is not available in this device",
             duration: 2000,
             type: 'danger'
          });
          return;
        }
          if(error==="LAErrorPasscodeNotSet"  ){
          Toast.show({
             text: "No pass code is set. Go to settings and set pass code. ",
             duration: 2000,
             type: 'danger'
          });
          return;
        }
        if(error==="LAErrorTouchIDNotEnrolled"  ){
          Toast.show({
             text: "No finger prints are registered. Go to settings and register your finger prints",
             duration: 2000,
             type: 'danger'
          });
          return;
        }
        if(error!=="LAErrorUserCancel" && error!=="LAErrorSystemCancel" ){
          Toast.show({
             text: "Authentication failed or cancelled by user. Try again ",
             duration: 2000,
             type: 'danger'
          });
          return;
        }
        if(error==="LAErrorUserFallback"){
          Toast.show({
             text: "Enter Passcode",
             duration: 2000,
             type: 'danger'
          });
          return;
        }
      });
  }

}

const styles = StyleSheet.create({
  touchIdStyle:{
     flex: 1, 
     justifyContent: 'center',
     flexDirection: 'row',
     alignItems:'center' 
  },
  imgStyle:{
      width: 50,
      height: 45
  },
});

export default connect(null, mapDispatchToProps)(TouchComponent);