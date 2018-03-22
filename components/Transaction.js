import React from 'react';
import { View, Text } from 'react-native';

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const Transaction = (props) => {
  const {op, date, value, place, currentBill} = props.transaction

  return  (<View style={style}>
    <Text>Operação: {op}</Text>
    <Text>Data: {formatDate(date)}</Text>
    <Text>Valor: {value}</Text>
    <Text>Local: {place}</Text>
    <Text>Pago: {currentBill ? 'não' : 'sim'}</Text>
  </View>);
};

const style = {
  marginBottom: 10,
  marginTop: 10,
};

export { Transaction };
