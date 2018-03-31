import React, { Component } from 'react';

import { TransactionsScreen } from './screens/TransactionsScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { CostsScreen } from './screens/CostsScreen';

import { TabNavigator, TabBarBottom } from 'react-navigation';
import { StatusBar } from 'react-native';
import Ionicons  from 'react-native-vector-icons/Ionicons';

const monthlyIncomes = [
  {name: 'Salário dz', value: 5000}
];
const monthlyExpenses = [
  {name: 'Aluguel', value: 900},
  {name: 'Condominio', value: 300},
  {name: 'Internet', value: 60},
  {name: 'Luz', value: 40},
  {name: 'MEI', value: 60},
  {name: 'Plano de saude', value: 300},
  {name: 'Hospital', value: 1100},
];

const Nav = TabNavigator({
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

export default class App extends React.Component {
  constructor(props) {
    super(props);

    StatusBar.setBackgroundColor('#000', true);

    this.state = {
      monthlyExpenses: monthlyExpenses
    };

    this.handleRemoveCost = this.handleRemoveCost.bind(this);
    this.handleAddCost = this.handleAddCost.bind(this);
  }

  handleRemoveCost(cost, index) {
    this.setState( prevState => ({
      monthlyExpenses: prevState.monthlyExpenses.filter((e, i) => { return i !== index })
    }));
  }

  handleAddCost(cost) {
    this.setState( prevState => ({
      monthlyExpenses: [...prevState.monthlyExpenses, {
        name: cost.name,
        value: parseFloat(cost.value)
      }]
    }));
  }

  render() {
    return <Nav screenProps={{
          monthlyIncomes: this.state.monthlyIncomes,
          monthlyExpenses: this.state.monthlyExpenses,

          handleRemoveCost: this.handleRemoveCost,
          handleAddCost: this.handleAddCost,
          name: 'Marcos'
        }}
      />;

  }
};
