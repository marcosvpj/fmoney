import React, { Component } from 'react';

import { TransactionsScreen } from './screens/TransactionsScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { CostsScreen } from './screens/CostsScreen';
import { IncomeScreen } from './screens/IncomeScreen';

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
  'Dívidas': { screen: CostsScreen },
  'A Receber': { screen: IncomeScreen },
  'Cartão': { screen: TransactionsScreen }
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
        if (routeName === 'Dívidas') return `md-apps`;
        if (routeName === 'A Receber') return `md-apps`;
        if (routeName === 'Cartão') return `md-card`;
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
      monthlyExpenses: monthlyExpenses,
      monthlyIncomes: monthlyIncomes
    };

    this.handleRemoveCost = this.handleRemoveCost.bind(this);
    this.handleAddCost = this.handleAddCost.bind(this);

    this.handleRemoveIncome = this.handleRemoveIncome.bind(this);
    this.handleAddIncome = this.handleAddIncome.bind(this);
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


  handleRemoveIncome(income, index) {
    this.setState( prevState => ({
      monthlyIncomes: prevState.monthlyIncomes.filter((e, i) => { return i !== index })
    }));
  }

  handleAddIncome(income) {
    this.setState( prevState => ({
      monthlyIncomes: [...prevState.monthlyIncomes, {
        name: income.name,
        value: parseFloat(income.value)
      }]
    }));
  }

  render() {
    return <Nav screenProps={{
          monthlyIncomes: this.state.monthlyIncomes,
          monthlyExpenses: this.state.monthlyExpenses,

          handleRemoveCost: this.handleRemoveCost,
          handleAddCost: this.handleAddCost,

          handleRemoveIncome: this.handleRemoveIncome,
          handleAddIncome: this.handleAddIncome,

          name: 'Marcos'
        }}
      />;

  }
};
