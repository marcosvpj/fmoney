import React from 'react';
import { TextInput, View, Text } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();
const creditCardDueDate = 7;
const budget = 1500;

const SmsParser = function (onFail, onSuccess) {
  const smsFilter = {
    box: 'inbox',
    address: '11108',
    maxCount: false //10
  };

  const getCreditCardNumber = (msg) => {
    return msg.match(/\d\d\d\d/g);
  };

  const getMessageTime = (sms) => {
    const date = sms.body.match(/(\d\d\/\d\d)/g).toString();
    const d = new Date(sms.date);
    return new Date(d.getFullYear(), date.substring(3,5), date.substring(0,2));
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
    onFail, 
    (count, smsList) => {
      const sms = JSON.parse(smsList);
      const transactions = sms.map( i => parseMessage(i) ).filter( m => !!m );

      onSuccess({sms: sms, transactions: transactions});
    }
  );
}

export { SmsParser };
