import React from 'react';
import { FlatList } from 'react-native';
import { Transaction } from './Transaction'

const Transactions = (props) => {
  const transactions = props.transactions

  console.log(props);
  return <FlatList 
    data={props.transactions}
    renderItem={
      ({item}) => <Transaction value={item.value} message={item.message} transaction={item} />
    }
    keyExtractor={(item, index) => item.id ? item.id : index.toString() }
  />;
};

export { Transactions };
