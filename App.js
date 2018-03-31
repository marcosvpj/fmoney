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
    style: {
      elevation: .3,
      backgroundColor: '#fff',
      borderTopColor: '#fff'
    }
  },
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      const iconName = () => {
        if (routeName === 'Resumo') return `md-cash`;
        if (routeName === 'Gastos') return `md-apps`;
        if (routeName === 'Transações') return `md-card`;
      }
      return <Ionicons name={iconName()} size={25} color={tintColor} />;
    },
  })
});
