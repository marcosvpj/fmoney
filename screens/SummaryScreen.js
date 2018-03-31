import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { Card, Header, Screen } from '../components';

import { SmsParser } from '../SmsParser';
import { $grey, $clear_background, $darker_text, $brigther_text, $income, $expense, $income_ligth, $expense_ligth } from '../styles/colors.js';

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

    const currentMonthSpendingBy = op => sumTransactionsValues(currentMonthTransactions.filter( t => t.op === op));
    const currentMonthCreditCard = currentMonthSpendingBy('credit');
    // const currentMonthSpending = sumTransactionsValues(currentMonthTransactions);
    const currentMonthSpending = currentMonthCreditCard;

    const valueAvaliable = (budget - currentMonthSpending).toFixed(2);
    const valueAvaliablePerDay = (valueAvaliable / this.daysLeft()).toFixed(2);

    const daySpending = this.state.transactions
      .filter( t => t.currentBill && t.date.getDate() === currentDay )
      .map( t => t.value )
      .reduce((p, c) => { return p + c}, 0)
      .toFixed(2);

    const avaliableToday = (valueAvaliablePerDay - daySpending).toFixed(2);

    const totalCosts = this.props.screenProps.monthlyExpenses
      .map(c => c.value)
      .reduce((p, c) => { return p + c }, 0)
      .toFixed(2);

    const income = 5000;
    const expense = (parseFloat(currentMonthSpendingBy('credit')) + parseFloat(totalCosts)).toFixed(2);

    // {this.props.navigation}
    // {this.props.screenProps.name}
    return (
      <Screen>
        <Header text={'F-Money!'}/>
        <ScrollView style={styles.screen}>
          <Text style={styles.instructions}>
            Make all the money!!1!
          </Text>
          { currentMonthSpending && <Text>Gastos do mês: {currentMonthSpending}</Text> }
          <Text>Dias restante para fechamento: {this.daysLeft()}</Text>
          <Text>Valor disponível: {!!valueAvaliable && valueAvaliable}</Text>
          <Text>Valor disponível por dia: {!!valueAvaliablePerDay && valueAvaliablePerDay}</Text>
          <Text>Valor disponível hoje: {!!valueAvaliablePerDay && avaliableToday}</Text>
          <Text>Gastos do dia: {!!daySpending && daySpending}</Text>

          <View style={styles.spacer}>
            <View style={[styles.card, styles.income]}>
              <Text style={styles.cardValue}>{'R$ ' + income}</Text>
              <Text style={styles.cardText}>{'ENTRADA'}</Text>
            </View>

            <View style={[styles.card, styles.expense]}>
              <Text style={styles.cardValue}>{'R$ ' + expense}</Text>
              <Text style={styles.cardText}>{'SAIDA'}</Text>
            </View>
          </View>

          <View style={styles.spacer}>
            <Card text={'CUSTOS FIXOS'} value={totalCosts} />
            <Card text={'SAQUES'} value={currentMonthSpendingBy('saque')} />
          {/* </View>

          <View style={styles.spacer}> */}
            <Card text={'CRÉDITO'} value={currentMonthSpendingBy('credit')} />
            <Card text={'DÉBITO'} value={currentMonthSpendingBy('debit')} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    width: '100%'
  },
  instructions: {
    textAlign: 'center',
    color: $grey,
    marginBottom: 5,
  },
  spacer: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },

  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $clear_background,
    margin: 5,
    height: 100,
    flexGrow: 1,
    padding: 5,
    borderRadius: 5,
    elevation: .3,
    borderStyle: 'solid',
  },

  income: {
    borderTopColor: $income,
    backgroundColor: $income_ligth,
    borderTopWidth: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  expense: {
    borderTopColor: $expense,
    backgroundColor: $expense_ligth,
    borderTopWidth: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  cardValue: {
    color: $darker_text,
    fontSize: 22
  },
  cardText: {
    color: $brigther_text,
    fontSize: 10,
    marginTop: 3
  },
});
