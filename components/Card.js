import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

const Card = (props) => {
  const {value, text, onPress} = props;
  
  const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  return  (
    <TouchableHighlight style={styles.card} onPress={onPress}>
      <View style={styles.center}>
        <Text style={styles.cardValue}>{isNumeric(value) ? 'R$ ' : ''}{value}</Text>
        <Text style={styles.cardText}>{text}</Text>
      </View>      
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', 
    margin: 10, 
    height: 100,
    width: 100, 
    padding: 5,
    borderRadius: 5,
    elevation: .3
  },
  cardValue: {
    color: '#000',
    fontSize: 15
  },
  cardText: {
    color: '#555',
    fontSize: 11,
    marginTop: 3
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export { Card };
