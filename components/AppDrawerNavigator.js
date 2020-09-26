import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import NotificationScreen from '../screens/Notification';
import MyRecievedItemsScreen from '../screens/MyRecievedItemsScreen';

import myBarters from '../screens/MyBarters';

import { Icon } from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppTabNavigator,
    navigationOptions: {
      drawerIcon: <Icon name="home" type="fontawesome5" />
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      drawerIcon: <Icon name="settings" type="fontawesome5" />,
      drawerLabel: 'Settings'
    }
  },
  MyBarters: {
    screen: myBarters,
    navigationOptions: {
      drawerIcon: <Icon name="gift" type="font-awesome" />,
      drawerLabel: 'My Barters'
    }
  },
  NotificationScreen: {
    screen: NotificationScreen,
    navigationOptions: {
      drawerIcon: <Icon name="bell" type="font-awesome" />,
      drawerLabel: 'Notifications'
    }
  },
  MyRecievedItemsScreen: {
    screen: MyRecievedItemsScreen,
    navigationOptions: {
      drawerIcon: <Icon name="gift" type="font-awesome" />,
      drawerLabel: 'My Recieved Items'
    }
  }
},
  {
    contentComponent: CustomSideBarMenu
  },
  {
    initialRouteName: 'Home'
  })
