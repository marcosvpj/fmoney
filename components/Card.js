import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

import { $border, $clear_background, $darker_text, $brigther_text, $cost } from '../styles/colors.js';

const Card = (props) => {
  const {value, text, onPress} = props;
  const height = props.height || 98;

  const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  return  (
    <TouchableHighlight style={[styles.card, {height: height}]} onPress={onPress}>
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
    backgroundColor: $clear_background,
    margin: 5,
    height: 98,
    width: 100,
    padding: 5,
    borderRadius: 5,
    elevation: .3,

    borderTopColor: $cost,
    borderTopWidth: 2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  cardValue: {
    color: $cost,
    fontSize: 15
  },
  cardText: {
    color: $brigther_text,
    fontSize: 10,
    marginTop: 3
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export { Card };
