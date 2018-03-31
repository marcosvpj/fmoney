import React from 'react';
import { StyleSheet, View, Image, ImageBackground, Text } from 'react-native';

const Header = (props) => {
  const {text} = props;

  return  (
    <View style={styles.header}>
      <ImageBackground source={require('./header.jpg')} style={styles.background} imageStyle={{ resizeMode: Image.resizeMode.cover }}>
        <Text style={styles.text}>
          {text}
        </Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: 'stretch'
    // width: 100;
  },
  background: { 
    width: undefined, 
    height: 120,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 50,
    color: '#FFF',
    fontWeight: 'bold'
  },
});

export { Header };
