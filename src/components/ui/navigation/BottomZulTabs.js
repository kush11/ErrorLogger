import React, { Component } from 'react';
import { Icon, Text } from 'native-base';
import { Platform, StyleSheet } from 'react-native';
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation';
import {fontMaker} from '../../utility/fonts/FontMaker';

export default class BottomZulTabs extends Component {

  tabs = [
    {
      key: 'home',
      icon: 'md-home',
      label: 'Home',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: "grey",
      screen: "Overview"
    },
    {
      key: 'checks',
      icon: 'md-list',
      label: 'Checks',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: "grey",
      screen: "AssessmentList"
    },
    {
      key: 'settings',
      icon: 'md-settings',
      label: 'Settings',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: "grey",
      screen: "UserSetting"
    }
  ];
  renderIcon = icon => ({ isActive }) => (
    isActive ? <Icon size={24} name={icon} style={{ color: '#144e76' }} /> : <Icon style={{ color: '#494949' }} size={24} name={icon} />
  )

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      labelStyle={{ color: (isActive ? '#144e76' : '#494949'),...bottomTabsFontStyle }}
      renderIcon={this.renderIcon(tab.icon)}
      style={styles.iosPadding}
    />
  )

  setNewTab = (newTab) => {
    // this.setState({ activeTab: newTab.key });
    this.props.navigator.navigate(newTab.screen);
  }

  render() {
    return (
      <BottomNavigation
        onTabPress={newTab => this.setNewTab(newTab)}
        renderTab={this.renderTab}
        tabs={this.tabs}
        activeTab={this.props.activeTab}
      />
    );
  };
}

const bottomTabsFontStyle = fontMaker({family: 'OpenSans', weight: 'Regular'});
const styles = StyleSheet.create({
  iosPadding: {
    ...Platform.select({
      ios: {
        paddingBottom: 15
      }
    })
  }

})
