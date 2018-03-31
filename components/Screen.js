import React from 'react';
import { StyleSheet, View, Image, ImageBackground, Text } from 'react-native';

const Screen = (props) => {
  const {children} = props;

  return  (
    <View style={styles.screen}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { 
    backgroundColor: '#F1F2F3', 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export { Screen };
