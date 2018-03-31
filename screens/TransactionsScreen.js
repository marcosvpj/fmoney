import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { Transactions } from '../components/Transactions';

type Props = {};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
const creditCardDueDate = 7;
const budget = 1500;

export class TransactionsScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      sms:[
        {_id: 1, body:'nada'}
      ],
      transactions: []
    };

    const smsFilter = {
      box: 'inbox',
      address: '11108',
      maxCount: false //10
    };

    const getCreditCardNumber = (msg) => {
      return msg.match(/\d\d\d\d/g);
    };

    const getMessageTime = (sms) => {
      return new Date(sms.date_sent);
      // const date = sms.body.match(/(\d\d\/\d\d)/g).toString();
      // const d = new Date(sms.date);
      // return new Date(d.getFullYear(), date.substring(3,5), date.substring(0,2));
    };

    const getTransactionValue = (msg) => {
      let value = msg.match(/(R\$ \d*,\d*)/g) ? msg.match(/(R\$ \d*,\d*)/g).toString() : '';
      value = msg.match(/(RS \d*,\d*)/g) ? msg.match(/(RS \d*,\d*)/g).toString() : value;

      value = value.trim();
      value = value.substring(2, value.length);
      value = value.trim();
      value = value.replace(',', '.');
      value = parseFloat(value);
      return value;
    }

    const getTransactionPlace = (msg) => {
      let place = msg.match(/Local: (.*\. )/g) ? msg.match(/Local: (.*\. )/g) : '';
      place = msg.match(/9148 - (.*\. )/g) ? msg.match(/9148 - (.*\. )/g) : place;
      if (place && place[0].indexOf(' valor') !== -1) {
        place = place[0].substring(7, place[0].indexOf(' valor'));
      } else if (place) {
        place = place[0].substring(7, place[0].length - 3);  
      }

      return place;
    }

    const getTransactionType = (msg) => {
      if (msg.match(/Compra aprovada no seu ICONTA MULT MC INTER final 9148/g)) {
        return 'credit';
      } else if (msg.match(/SAQUE APROVADO/g)) {
        return 'saque';
      } else if (msg.match(/ITAU DEBITO:/g)) {
        return 'debit';
      }

      return false;
    }

    const parseWithdraw = (sms) => {
      return {
        id: sms._id.toString(),
        op: 'saque',
        place: getTransactionPlace(sms.body),
        date: getMessageTime(sms),
        card_number: getCreditCardNumber(sms.body),
        value: getTransactionValue(sms.body)
      };
    };

    const parseMessage = (sms) => {
      if (!sms.body) return false;
      if (!sms.body.match(/Compra aprovada no seu ICONTA MULT MC INTER final 9148/g) && !sms.body.match(/ITAU DEBITO:/g)) return false;
      
      const op = getTransactionType(sms.body);
      if (!op) return false;

      const dateFrame = (t) => {
        if (currentDay >= creditCardDueDate) {
          return (t.getMonth() === currentMonth && t.getDate() >= 7) 
        } else {
          return t.getMonth() === currentMonth || (t.getMonth() === currentMonth-1 && t.getDate() >= 7)  
        }
      };

      return {
        id: sms._id.toString(),
        card_number: getCreditCardNumber(sms.body), 
        value: getTransactionValue(sms.body), 
        date: getMessageTime(sms), 
        place: getTransactionPlace(sms.body), 
        message: sms.body,
        op: op,
        currentBill: dateFrame(getMessageTime(sms))
      };
    }

    SmsAndroid.list(
      JSON.stringify(smsFilter), 
      fail => console.log('sms list fail:' + fail), 
      (count, smsList) => {
        const sms = JSON.parse(smsList);
        const transactions = sms.map( i => parseMessage(i) ).filter( m => !!m );
        this.setState({sms: sms, transactions: transactions});

        const currentMonthSpending = transactions
        .filter( t => t.currentBill )
        .map( t => t.value )
        .reduce((p, c) => { return p + c}, 0)
        .toFixed(2);
 
        this.setState({currentMonthSpending: currentMonthSpending});
      }
    );
  }
  
  render() {
    const daysLeft = () => {
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  
      if (currentDay === creditCardDueDate) return daysInMonth;
      if (currentDay > creditCardDueDate) return daysInMonth - currentDay + creditCardDueDate;
      if (currentDay < creditCardDueDate) return creditCardDueDate - currentDay;
      return 0;
    };

    const valueAvaliable = (budget - this.state.currentMonthSpending).toFixed(2);
    const valueAvaliablePerDay = (valueAvaliable / daysLeft()).toFixed(2);
    const daySpending = this.state.transactions
    .filter( t => t.currentBill && t.date.getDate() === currentDay )
    .map( t => t.value )
    .reduce((p, c) => { return p + c}, 0)
    .toFixed(2);
    const avaliableToday = (valueAvaliablePerDay - daySpending).toFixed(2);


    return (
      <View style={styles.container}>
        {/* <Text style={styles.welcome}>
          Welcome to F-Money!
        </Text>
        <Text style={styles.instructions}>
          Make all money!!1!
        </Text>
        { this.state.currentMonthSpending && <Text>Gastos do mês: {this.state.currentMonthSpending}</Text> }
        <Text>Dias restante para fechamento: {daysLeft()}</Text>
        <Text>Valor disponível: {!!valueAvaliable && valueAvaliable}</Text>
        <Text>Valor disponível por dia: {!!valueAvaliablePerDay && valueAvaliablePerDay}</Text>
        <Text>Valor disponível hoje: {!!valueAvaliablePerDay && avaliableToday}</Text>
        <Text>Gastos do dia: {!!daySpending && daySpending}</Text> */}
        <Transactions transactions={this.state.transactions} style={styles.transactions} />
      </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
