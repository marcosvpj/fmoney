import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { Card, Header, Screen } from '../components';

import { SmsParser } from '../SmsParser';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();
const creditCardDueDate = 7;
const budget = 1500;

export class SummaryScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sms:[
        {_id: 1, body:'nada'}
      ],
      transactions: []
    };
    
    SmsParser(
      fail => console.log('sms list fail:' + fail), 
      ({sms, transactions}) => {
        this.setState({sms: sms, transactions: transactions});
      }
    );
  }

  daysLeft () {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    if (currentDay === creditCardDueDate) return daysInMonth;
    if (currentDay > creditCardDueDate) return daysInMonth - currentDay + creditCardDueDate;
    if (currentDay < creditCardDueDate) return creditCardDueDate - currentDay;
    return 0;
  };

  render() {
    const currentMonthTransactions = this.state.transactions
      .filter( t => t.currentBill );

    const sumTransactionsValues = (transactions) => { 
      return transactions.map( t => t.value )
      .reduce((p, c) => { return p + c}, 0)
      .toFixed(2);
    }

    const currentMonthSpending = sumTransactionsValues(currentMonthTransactions);

    const currentMonthSpendingBy = op => sumTransactionsValues(currentMonthTransactions.filter( t => t.op === op));

    const valueAvaliable = (budget - currentMonthSpending).toFixed(2);

    const valueAvaliablePerDay = (valueAvaliable / this.daysLeft()).toFixed(2);

    const daySpending = this.state.transactions
      .filter( t => t.currentBill && t.date.getDate() === currentDay )
      .map( t => t.value )
      .reduce((p, c) => { return p + c}, 0)
      .toFixed(2);

    const avaliableToday = (valueAvaliablePerDay - daySpending).toFixed(2);

    const totalCosts = this.props.screenProps.fixedCosts
      .map(c => c.value)
      .reduce((p, c) => { return p + c }, 0)
      .toFixed(2);

    // {this.props.navigation}
    // {this.props.screenProps.name}
    return (
      <Screen>
        <Header text={'F-Money!'}/>
        <Text style={styles.instructions}>
          Make all the money!!1! 
        </Text>
        { currentMonthSpending && <Text>Gastos do mês: {currentMonthSpending}</Text> }
        <Text>Dias restante para fechamento: {this.daysLeft()}</Text>
        <Text>Valor disponível: {!!valueAvaliable && valueAvaliable}</Text>
        <Text>Valor disponível por dia: {!!valueAvaliablePerDay && valueAvaliablePerDay}</Text>
        <Text>Valor disponível hoje: {!!valueAvaliablePerDay && avaliableToday}</Text>
        <Text>Gastos do dia: {!!daySpending && daySpending}</Text>

        <View style={{marginTop: 25, flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
          <Card text={'CUSTOS FIXOS'} value={totalCosts} />
          <Card text={'SAQUES'} value={currentMonthSpendingBy('saque')} />
        </View>
        
        <View style={{marginTop: 25, flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
          <Card text={'CRÉDITO'} value={currentMonthSpendingBy('credit')} />
          <Card text={'DÉBITO'} value={currentMonthSpendingBy('debit')} />
        </View>
        
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  transactions: {
    paddingTop: 15
  }
});
