import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import React from 'react';
import { Platform, Image } from 'react-native';
import LogIn from '../screens/login/Login';
import SwitchLogin from '../screens/login/Login';
import OnBoard from '../components/ui/onboard/OnBoard';
import PreOnBoard from '../components/ui/onboard/PreOnBoard'
import StartPage from '../screens/onboard/StartPage';
import Register from '../screens/register/Register';
import Home from '../components/ui/home/Home';
import AssessmentList from '../screens/assessmentList/AssessmentList';
import Assessment from '../screens/assessment/Assessment';
import AssessmentInfo from '../screens/assessment/AssessmentInfo';
import AssessmentReport from '../screens/assessmentReport/AssessmentReport';
import Overview from '../screens/overview/Overview';
import UserSetting from '../screens/userSettings/UserSettings'
import PersonalSetting from '../screens/userSettings/PersonalSettings';
import PrivacySetting from '../screens/userSettings/PrivacySetting';
import TermsConditions from '../screens/userSettings/TermsConditions';
import ReportIssue from '../screens/userSettings/ReportIssue';
import ChangePasscode from '../screens/userSettings/ChangePasscode'
import ForgotPassword from '../screens/login/ForgotPasscode/ForgotPassword'
import CheckYourWellness from '../screens/checkYourWellness/CheckYourWellness'
import MinimunReport from '../screens/assessmentReport/MinimumReport'
import Bmi from '../screens/assessment/BmiScreen'
import ChangeHeight from '../screens/userSettings/HeightChange'
import ChangeWeight from '../screens/userSettings/WeightChange'
import BiologicalReport from '../screens/assessmentReport/BiologicalAgeReport';
import { fontMaker } from '../components/utility/fonts/FontMaker';

const titlebarColor = '#144E76';
const questionFontStyle = fontMaker({family: 'OpenSans', weight: 'Regular'});

const RegisterRoute = createStackNavigator({
  StartPage: {
    screen: StartPage,
    navigationOptions: {
      header: null
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null
    }
  },

},
  {
    ...Platform.select({
      ios: {
        navigationOptions: {
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        },
        android: {
          navigationOptions: {
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }
        }
      }
    },
    )

  });
const LoginRoute = createStackNavigator({
  StartPage: {
    screen: StartPage,
    navigationOptions: {
      header: null
    }
  },
  LogIn: {
    screen: LogIn,
    navigationOptions: {
      header: null
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: null
    }
  },
}, {
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  }
);
const RouteWithoutRegistrartion = createStackNavigator({
  StartPage: {
    screen: StartPage,
    navigationOptions: {
      header: null
    }
  },
  CheckYourWellness: {
    screen: CheckYourWellness,
    navigationOptions: {
      title: 'Check Your Wellness',
      headerTintColor:titlebarColor
    }
  },
  AssessmentInfo: {
    screen: AssessmentInfo,
    navigationOptions: {
      header: null
    }
  },
  Assessment: {
    screen: Assessment,
    navigationOptions: {
      header: null,
      title: null
    }
  },
  Bmi: {
    screen: Bmi,
    navigationOptions: {
      title: 'Enter Your Details',
      headerTintColor: titlebarColor
    }
  },
  StartPage: {
    screen: StartPage,
    navigationOptions: {
      header: null
    }
  },
}, {
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  }
);
const OverviewRoute = createStackNavigator({
  Overview: {
    screen: Overview,
    navigationOptions: {
      //sheight: (Platform.OS === 'ios') ? 100 : 0,
      headerTitle: (
        <Image style={{ alignSelf:'center' ,flex: 1,height: 30, resizeMode: 'contain'}} source={require('../assets/images/onboard/zulNew.png')} />
      ),
      fontFamily: 'System',
    }
  },
  UserSetting: {
    screen: UserSetting,
    navigationOptions: {
      title: 'Settings',
      fontFamily: 'System',
      headerTintColor: titlebarColor
    }
  },
  PersonalSetting: {
    screen: PersonalSetting,
    navigationOptions: {
      title: 'Personal Settings',
      headerTintColor: titlebarColor
    }
  },
  PrivacySetting: {
    screen: PrivacySetting,
    navigationOptions: {
      title: 'Privacy Settings',
      headerTintColor: titlebarColor
    }
  },
  TermsConditions: {
    screen: TermsConditions,
    navigationOptions: {
      title: 'Terms & Conditions',
      headerTintColor: titlebarColor
    }
  },
  ReportIssue: {
    screen: ReportIssue,
    navigationOptions: {
      title: 'Help',
      headerTintColor: titlebarColor
    }
  },
  ChangePasscode: {
    screen: ChangePasscode,
    navigationOptions: {
      title: 'Change Passcode',
      headerTintColor: titlebarColor
    }
  },
  ChangeHeight: {
    screen: ChangeHeight,
    navigationOptions: {
      title: 'Height',
      headerTintColor: titlebarColor
    }
  },
  ChangeWeight: {
    screen: ChangeWeight,
    navigationOptions: {
      title: 'Weight',
      headerTintColor: titlebarColor
    }
  },

  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  AssessmentList: {
    screen: AssessmentList,
    navigationOptions: {
      title: 'Checks',
      fontFamily: 'System',
      headerTintColor: titlebarColor
    }
  },
  AssessmentInfo: {
    screen: AssessmentInfo,
    navigationOptions: {
      header: null
    }
  },
  Assessment: {
    screen: Assessment,
    navigationOptions: {
      header: null,
      title: null
    }
  },
  Bmi: {
    screen: Bmi,
    navigationOptions: {
      title: 'Enter Your Details',
      headerTintColor: titlebarColor
    }
  },
},
  {
    ...Platform.select({
      ios: {
        navigationOptions: {
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: titlebarColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }
      }
    }),
    android: {
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: titlebarColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }
    }
  },
);
const ReportWithoutRegistrationRoute = createStackNavigator({
  StartPage: {
    screen: StartPage,
    navigationOptions: {
      header: null
    }
  },
  CheckYourWellness: {
    screen: CheckYourWellness,
    navigationOptions: {
      title: 'Check Your Wellness',
      headerTintColor: titlebarColor
    }
  },
  MinimunReport: {
    screen: MinimunReport,
    navigationOptions: {
      header: null
    }
  },
}, {
    ...Platform.select({
      ios: {
        navigationOptions: {
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: titlebarColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }
      }
    }),
    android: {
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'white',

        },
        headerTintColor: titlebarColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }
    }
  },
);
const ReportRoute = createStackNavigator({
  OverviewRoute: {
    screen: OverviewRoute,
    navigationOptions: {
      header: null
    }
  },
  AssessmentList: {
    screen: AssessmentList,
    navigationOptions: {
      title: 'Checks',
      fontFamily: 'System',
      headerTintColor: titlebarColor
    }
  },
  BiologicalReport: {
    screen: BiologicalReport,
    navigationOptions: {
      header: null
    }
  },
  AssessmentReport: {
    screen: AssessmentReport,
    navigationOptions: {
      header: null
    }
  }
}, {
    ...Platform.select({
      ios: {
        navigationOptions: {
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: titlebarColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }
      }
    }),
    android: {
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'white',

        },
        headerTintColor: titlebarColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }
    }
  },
);
const CheckListRoute = createStackNavigator({
  Overview: {
    screen: Overview,
    navigationOptions: {
      header: null
    }
  },
  AssessmentList: {
    screen: AssessmentList,
    navigationOptions: {
      header: null
    }
  },
  AssessmentInfo: {
    screen: AssessmentInfo,
    navigationOptions: {
      header: null
    }
  },
  Assessment: {
    screen: Assessment,
    navigationOptions: {
      header: null,
      title: null
    }
  },

}, {
    navigationOptions: {
      ...Platform.select({
        ios: {
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: titlebarColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        },
        android: {
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: titlebarColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }
      })
    }
  });
const AppRoute = createSwitchNavigator({
  PreOnBoard: {
    screen: PreOnBoard,
    navigationOptions: {
      header: null
    }
  },
  OnBoard: {
    screen: OnBoard,
    navigationOptions: {
      header: null
    }
  },
  RouteWithoutRegistrartion: {
    screen: RouteWithoutRegistrartion,
    navigationOptions: {
      header: null
    }
  },
  RegisterRoute: {
    screen: RegisterRoute,
    navigationOptions: {
      header: null
    }
  },
  LoginRoute: {
    screen: LoginRoute,
    navigationOptions: {
      header: null
    }
  },
  OverviewRoute: {
    screen: OverviewRoute,
    navigationOptions: {
      header: null
    }
  },
  CheckListRoute: {
    screen: CheckListRoute,
    navigationOptions: {
      header: null
    }
  },
  ReportWithoutRegistrationRoute: {
    screen: ReportWithoutRegistrationRoute,
    navigationOptions: {
      header: null
    }
  },
  ReportRoute: {
    screen: ReportRoute,
    navigationOptions: {
      header: null
    }
  }
});

export default AppRoute;