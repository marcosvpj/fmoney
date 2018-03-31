/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */ 

import React, { Component } from 'react';

import { TransactionsScreen } from './screens/TransactionsScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { CostsScreen } from './screens/CostsScreen';

import { TabNavigator, TabBarBottom } from 'react-navigation';
import Ionicons  from 'react-native-vector-icons/Ionicons';

export default TabNavigator({
  'Resumo': { screen: SummaryScreen },
  'Gastos': { screen: CostsScreen },
  'Transações': { screen: TransactionsScreen }
}, {
  initialRouteName: 'Resumo',
  initialRouteParams: { name: 'teste param' },
  tabBarPosition: 'bottom',
  tabBarComponent: TabBarBottom,
  tabBarOptions: {
    // inactiveTintColor: 'gray',
    style: {
      elevation: .3,
      backgroundColor: '#fff',
      borderTopColor: '#fff'
    }
  },
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      // return <Ionicons name={'ios-card'} size={25} color={tintColor} />;
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Resumo') {
        iconName = `md-cash`;
      } else if (routeName === 'Gastos') {
        iconName = `md-apps`;
      } else if (routeName === 'Transações') {
        iconName = `md-card`;
      }

      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  })
});
