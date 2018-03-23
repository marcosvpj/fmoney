/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */ 

import React, { Component } from 'react';

import { TransactionsScreen } from './screens/TransactionsScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { TabNavigator } from 'react-navigation';

export default TabNavigator({
  'Resumo': { screen: SummaryScreen },
  'Transações': { screen: TransactionsScreen }
});
