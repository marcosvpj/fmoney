import React, { Component } from 'react';

import { TransactionsScreen } from './screens/TransactionsScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { CostsScreen } from './screens/CostsScreen';

import { TabNavigator, TabBarBottom } from 'react-navigation';
import Ionicons  from 'react-native-vector-icons/Ionicons';


const monthlyEarnings = 5000;
const fixedCosts = [
  {name: 'Aluguel', value: 900},
  {name: 'Condominio', value: 300},
  {name: 'Internet', value: 60},
  {name: 'Luz', value: 40},
  {name: 'MEI', value: 60},
  {name: 'Plano de saude', value: 300},
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

    this.state = {
      fixedCosts: fixedCosts
    };

    this.handleRemoveCost = this.handleRemoveCost.bind(this);
    this.handleAddCost = this.handleAddCost.bind(this);
  } 

  handleRemoveCost(cost, index) {
    this.setState( prevState => ({
      fixedCosts: prevState.fixedCosts.filter((e, i) => { return i !== index })
    }));
  }

  handleAddCost(cost) {
    this.setState( prevState => ({
      fixedCosts: [...prevState.fixedCosts, {
        name: cost.name, 
        value: parseFloat(cost.value)
      }]
    }));
  }
  
  render() {
    return <Nav screenProps={{
      fixedCosts: this.state.fixedCosts,
      handleRemoveCost: this.handleRemoveCost,
      handleAddCost: this.handleAddCost,
      name: 'Marcos'
    }} handleRemoveCost={this.handleRemoveCost} />
  }
};
