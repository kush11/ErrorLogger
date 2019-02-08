import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, AsyncStorage, ImageBackground } from 'react-native';
import { Text } from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import {regularButtonFont, fontMaker} from '../../utility/fonts/FontMaker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


class OnBoard extends Component {

  _renderItem = (props) => (
    <LinearGradient colors={["#fff","#fff"]} style={styles.linearGradientStyle}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.sliderContainer}>
      {props.icon.map(icon=>{
        return <Icon name={icon} size={100} color={props.color} key={icon} />
      })}
        
      </View>
      <View style={{ flex: 2 }}>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </LinearGradient>
  );

  _done = () => {
    AsyncStorage.setItem('isFirstTimeUser', "false", (err, result) => {

      this.props.navigation.navigate("LoginRoute")

    });

  }
  _renderSkipButton = () => {
    return (
      <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
        <Text style={{...regularButtonFont, color:'#ccc',paddingTop:10}}>
          Skip
        </Text>
      </View>
    );
  }

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        onDone={this._done}
        onSkip={this._done}
        renderSkipButton= {this._renderSkipButton}
        bottomButton
        showSkipButton
        activeDotStyle={{backgroundColor:'#455a64'}}
      />
    );
  }
}

const titleFontStyle = fontMaker({family: 'OpenSans', weight: 'SemiBold'});
const descriptionFontStyle = fontMaker({family: 'Montserrat', weight: 'Regular'});
const styles = StyleSheet.create({
  sliderContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginVertical: 20,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageLandscape: {
    width: 150,
    height: 150
  },
  linearGradientStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    padding: 30,
    paddingTop:80,
    flexDirection: 'column'
  },
  text: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    color: '#546e7a',
    fontSize: 20,
    ...descriptionFontStyle
  },
  title: {
    fontSize: 30,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#546e7a',
    ...titleFontStyle
  }
});

const slides = [
  // {
  //   key: 'sd00',
  //   title: 'Wellness World',
  //   text: 'ZingUpLife introduces you with 8 dimensions of wellness, Re-discover yourself.',
  //   icon: require('../../../assets/images/onboard/4.png'),
  //   colors: ['#348F50', '#56B4D3']
  // },
  {
    key: 'sd0',
    title: 'Physical',
    text: 'Physical Activity & Fitness, Diet & Nutrition, Medical Self-Care',
    //icon: require('../../../assets/images/onboard/physical.png'),
    icon:['human'],
    colors: ['#43cea2', '#185a9d'],
    color:'#003c8f'
  },
  {
    key: 'sd1',
    title: 'Emotional',
    text: 'Stress Management, Depression & Anxiety, Crisis Care',
    //icon: require('../../../assets/images/onboard/emotional.png'),
    icon: ['emoticon-happy','emoticon-sad'],
    colors: ['#1A2980', '#26D0CE'],
    color:'#fbc02d'
  },
  {
    key: 'sd2',
    title: 'Environmental',
    text: 'Respect for & Awareness of Surroundings, Community Impact ',
    //icon: require('../../../assets/images/onboard/environmental.png'),
    icon:['leaf'],
    colors: ['#348F50', '#56B4D3'],
    color:'#76ff03'
  },
  {
    key: 'sd3',
    title: 'Financial',
    text: "Financial Behaviour & Outcomes, Managing Expenses & Financial Stress",
    //icon: require('../../../assets/images/onboard/financial.png'),
    icon:['finance'],
    colors: ['#02AAB0', '#00CDAC'],
    color:'#d50000'
  },
  {
    key: 'sd4',
    title: 'Intellectual',
    text: 'Creativity, Curiosity & Lifelong Learning for Personal and Career Development',
    //icon: require('../../../assets/images/onboard/intellectual.png'),
    icon:['school'],
    colors: ['#314755', '#26a0da'],
    color:'#0d47a1'
  },
  {
    key: 'sd5',
    title: 'Occupational',
    text: 'Safe and Nurturing Workplace Environment, Addressing Stress',
    //icon: require('../../../assets/images/onboard/occupational.png'),
    icon:['briefcase-check'],
    colors: ['#373B44', '#4286f4'],
    color:'#0288d1'
  },
  {
    key: 'sd6',
    title: 'Social',
    text: 'Meaningful Relationships with Family, Friends, Community & Co-Workers ',
    //icon: require('../../../assets/images/onboard/social.png'),
    icon: ['wechat'],
    colors: ['#8360c3', '#2ebf91'],
    color:'#fb8c00'
  },
  {
    key: 'sd7',
    title: 'Spiritual',
    text: 'Love, Hope, Charity, Values & Beliefs',
    //icon: require('../../../assets/images/onboard/spiritual.png'),
    icon:['yin-yang'],
    colors: ['#283c86', '#45a247'],
    color:'#ff1744'
  }
];

export default OnBoard;
