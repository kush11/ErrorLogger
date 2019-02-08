import React, { Component } from 'react';
import { Platform, View, StyleSheet, Image, TouchableHighlight, TouchableOpacity, BackHandler, Alert, ToastAndroid, ScrollView } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Text, Badge, Card, Toast } from 'native-base';
import { connect } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { getLabel } from "../../components/utility/locale/I18N";
import OverviewStatsApi from '../../api/overview/OverviewService';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getLoggedInUserName } from '../../repository/login/LoginRepository';
import { updateFetchedUrl } from '../../store/actions/index'
import { BASE_URL, headers } from '../../api/config/Config';
import BottomZulTabs from '../../components/ui/navigation/BottomZulTabs';
import { getImageHandler } from '../../components/utility/userImage/GetUserImage';
import { fontMaker, defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  dimensionReport: state.Assessment.dimensionReport,
  userName: state.User.name
})

const mapDispatchToProps = dispatch => ({
  updateFetchedUrl: (url) => dispatch(updateFetchedUrl(url))
})

const chunkArray = (myArray, chunk_size) => {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }
  return tempArray;
}



//Component to display Overview information for user's wellbeing
//Consists two components
//CardInfo show overall wellness and provide navigation across all module vitals,checks,experts and goals
//DimensionCard show wellness across various dimensions

class Overview extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload => { this.overViewService() });
    this.logoutHandle = this._logoutHandle.bind(this);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.logoutHandle))
  }
  overViewService = () => {
    let username = {
      userName: this.props.userName
    };
    OverviewStatsApi.getOverviewStats(username)
      .then((responseJson) => {
        this.setState({
          checkCount: (responseJson.totalAssessmentCount - responseJson.givenAssessmentCount)
        });

      })
  }
  toastMessage = () => {
    Toast.show({
      text: "This feature will be Available Soon",
      duration: 2000,
      type: 'default'
    })
    //ToastAndroid.show('This feature will be Available Soon', ToastAndroid.SHORT,ToastAndroid.BOTTOM)
  }

  goToSettings = () => {
    this.props.navigation.navigate("UserSetting");
  }
  groupArray = chunkArray(this.props.dimensionReport, 2);
  state = {
    checkCount: 0,
    showSCLAlert: false,
    alertTitle: ""
  }

  handleOpen = (title) => {
    this.setState({ showSCLAlert: true, alertTitle: title })
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
  }

  logoutAlert = () => {
    return (
      Alert.alert(
        'Zing Up Life',
        'Do you want to exit this application?',
        [
          { text: 'No', onPress: () => console.log('Cancel Pressed') },
          {
            text: 'Yes', onPress: () => BackHandler.exitApp()
          },
        ],
        { cancelable: false }
      )
    )
  };

  _logoutHandle = () => {
    this.logoutAlert()
    return true
  }
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.logoutHandle)
    );
  }
  componentWillMount() {
    this.overViewService();
    getImageHandler(this.props.userName, this.props.updateFetchedUrl)
  }
  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.logoutHandle)
  }

  iconComponent = (iconName, iconSize, iconColor) => (
    <View style={styles.iconContainer}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </View>
  );

  materialCommunityIconComponent = (iconName, iconSize, iconColor) => (
    <View style={styles.topIconContainer}>
      <MaterialCommunityIcon name={iconName} size={iconSize} color={iconColor} />
    </View>
  );


  iconComponentForModal = (iconName, iconSize, iconColor, colorArray) => (
    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={colorArray} style={{ flex: 1, width: "100%", borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
      {this.iconComponent(iconName, iconSize, iconColor)}
    </LinearGradient>
  );

  iconMaterialComponentForModal = (iconName, iconSize, iconColor, colorArray) => (
    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={colorArray} style={{ flex: 1, width: "100%", borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
      {this.materialCommunityIconComponent(iconName, iconSize, iconColor)}
    </LinearGradient>
  );

  getIconComponentForModal = (alertTitle) => {
    let iconComponent = null;
    let dimensionColorArray = ['#6FD3EE', '#A969EE'];
    switch (alertTitle.split(" ")[0]) {
      case 'Vitals':
        iconComponent = this.iconComponentForModal("heartbeat", 50, "#FFF", ['#6FD3EE', '#A969EE']);
        break;
      case 'Goals':
        iconComponent = this.iconComponentForModal("bullseye", 50, "#FFF", ['#E9214C', '#D78CE7']);
        break;
      case 'Experts':
        iconComponent = this.iconComponentForModal("address-book", 50, "#FFF", ['#F29B3C', '#F66FD8']);
        break;
      case 'Physical':
        iconComponent = this.iconMaterialComponentForModal("human", 50, "#FFF", dimensionColorArray);
        break;
      case 'Emotional':
        iconComponent = this.iconMaterialComponentForModal("emoticon-happy", 50, "#FFF", dimensionColorArray);
        break;
      case 'Environmental':
        iconComponent = this.iconMaterialComponentForModal("leaf", 50, "#FFF", dimensionColorArray);
        break;
      case 'Financial':
        iconComponent = this.iconMaterialComponentForModal("finance", 50, "#FFF", dimensionColorArray);
        break;
      case 'Intellectual':
        iconComponent = this.iconMaterialComponentForModal("school", 50, "#FFF", dimensionColorArray);
        break;
      case 'Occupational':
        iconComponent = this.iconMaterialComponentForModal("briefcase-check", 50, "#FFF", dimensionColorArray);
        break;
      case 'Social':
        iconComponent = this.iconMaterialComponentForModal("wechat", 50, "#FFF", dimensionColorArray);
        break;
      case 'Spiritual':
        iconComponent = this.iconMaterialComponentForModal("yin-yang", 50, "#FFF", dimensionColorArray);
        break;
      default:
        break;
    }
    return iconComponent;
  }


  render() {
    const vitals = this.iconComponent("heartbeat", 60, "#FFF");
    const goals = this.iconComponent("bullseye", 60, "#FFF");
    const experts = this.iconComponent("address-book", 60, "#FFF");

    const headerIcon = this.getIconComponentForModal(this.state.alertTitle);
    return (
      <Container>
        <SCLAlert
          show={this.state.showSCLAlert}
          title={this.state.alertTitle}
          subtitle="This feature will be available soon."
          cancellable={true}
          onRequestClose={this.handleClose}
          headerContainerStyles={{ backgroundColor: '#41ab3e' }}
          headerIconComponent={headerIcon}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="success" onPress={this.handleClose} textStyle={{ ...regularButtonFont }}
          >OK</SCLAlertButton>
        </SCLAlert>
        <ScrollView scrollEnabled={false}>
          <ScrollView
            horizontal={true}
            directionalLockEnabled={true}
            contentContainerStyle={{ height: 200, width: 1200, backgroundColor: "#f7f7f7",paddingTop:10 }}
            style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Physical Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("human", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Physical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Emotional Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("emoticon-happy", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Emotional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Environmental Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("leaf", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Environmental</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Financial Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("finance", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Financial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Intellectual Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("school", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Intellectual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Occupational Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("briefcase-check", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Occupational</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Social Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("wechat", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Social</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.handleOpen('Spiritual Dimension')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent("yin-yang", 60, "#FFF")}
              </LinearGradient>
              <Text style={styles.dimensionText}>Spiritual</Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
        <ScrollView style={{top:-5}}>
          <View style={styles.homeContainer} >
            <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate("AssessmentList")}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#41D387', '#12BCEB']} style={[styles.left]}>
                <View style={styles.iconContainer}>
                  <Icon name="check-square-o" size={60} color="#fff" />
                </View>
                <Text style={{ color: "#fff", ...questionFontStyle }}>CHECKS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="pending" value={this.state.checkCount} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => this.handleOpen('Vitals')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.left]}>
                {vitals}
                <Text style={{ color: "#FFF", ...questionFontStyle }}>VITALS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="active" value="0" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => this.handleOpen('Goals')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#E9214C', '#D78CE7']} style={[styles.left]}>
                {goals}
                <Text style={{ color: "#FFF", ...questionFontStyle }}>GOALS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="created" value="0" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => this.handleOpen('Experts')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#F29B3C', '#F66FD8']} style={[styles.left]}>
                {experts}
                <Text style={{ color: "#FFF", ...questionFontStyle }}>EXPERTS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="meetups" value="0" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View>
          <BottomZulTabs navigator={this.props.navigation} activeTab={'home'} />
        </View>
      </Container>
    )
  }
}

const questionFontStyle = fontMaker({ family: 'OpenSans', weight: 'Bold' });
const dimensionFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const badgeFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: '#f7f7f7',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    paddingHorizontal: 10,
    color: '#495057',
    fontSize: 13,
    fontWeight: 'bold'
  },
  smallCard: {
    height: 150,
    width: 150,
    justifyContent: 'flex-start',
    flexDirection: "column",
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderColor: 'transparent',
    paddingTop: 10
  },
  topIcon: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'column',
    height: "60%",
    borderRadius: 6,
    elevation: 5,
    borderWidth: .15,
    borderColor: 'transparent',
    borderBottomWidth: 0,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: '#90a4ae',
    shadowOpacity: 5.0
  },
  topIconContainer: {
    width: 90,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dimensionText: {
    ...dimensionFontStyle,
    color: "#144e76",
    paddingTop:5,
    fontSize: 14
  },
  card: {
    height: 120,
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: "row",
    marginTop: 30,
    elevation: 5,
    borderWidth: .15,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'transparent',
    shadowOffset: { width: 4, height: 4 },
    shadowColor: '#90a4ae',
    shadowOpacity: 5.0
  },
  left: {
    width: "40%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: 'column',
    height: "102%",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  iconContainer: {
    top: 5,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: "100%",
    width: "60%",
    paddingLeft: 50
  }
})


//Small components
//ok to put inline css

const CardInfo = (props) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text style={{ fontSize: 40, color: '#37474f' }}>{props.value}</Text>
      <Badge style={{ backgroundColor: 'transparent' }} success>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#963EBC', '#9B80B3']} style={{ borderRadius: 10, padding: 1 }}>
          <Text style={{ ...badgeFontStyle }}>{props.type}</Text>
        </LinearGradient>
      </Badge>
    </View>
  )
}



export default connect(mapStateToProps, mapDispatchToProps)(Overview);
