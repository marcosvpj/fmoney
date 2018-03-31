import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableHighlight
} from 'react-native';
import { Button, Input, Card, Screen, Header } from '../components/';

const monthlyEarnings = 5000;
const fixedCosts = [
  {name: 'Aluguel', value: 900},
  {name: 'Condominio', value: 300},
  {name: 'Internet', value: 60},
  {name: 'Luz', value: 40},
  {name: 'MEI', value: 60},
  {name: 'Plano de saude', value: 300},
];

const DOUBLE_PRESS_DELAY = 300;

export class CostsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixedCosts: fixedCosts,
      showAddCost: false,
      addCost: {
        name: '',
        value: ''
      }
    };
  }

  onPressCostCard(cost, index) {
    const now = new Date().getTime();
    if (this.lastCardPress && (now - this.lastCardPress) < DOUBLE_PRESS_DELAY) {
      delete this.lastCardPress;
      this.handleCardDoublePress(cost, index);
    }
    else {
      this.lastCardPress = now;
    }
  }

  handleCardDoublePress(cost, index) {
    this.setState( prevState => ({
      fixedCosts: prevState.fixedCosts.filter((e, i) => { return i !== index })
      // fixedCosts: prevState.fixedCosts.filter((e, i) => { return e.name !== cost.name })
    }));
  }

  onPressAddCost() {
    // this.showModalAddCosts(true);
    this.setState({showAddCost: true});
  }

  addCost() {
    this.setState({showAddCost: false});
    this.setState( prevState => ({
      fixedCosts: [...prevState.fixedCosts, {
        name: this.state.addCost.name, 
        value: parseFloat(this.state.addCost.value)
      }]
    }));
  }

  showModalAddCosts(show) {
    this.setState({showAddCost: show});
  }

  render() {
    const total = this.state.fixedCosts
      .map(c => c.value)
      .reduce((p, c) => { return p + c }, 0)
      .toFixed(2);

    return (
      <Screen style={{flex:1, flexDirection: 'column'}}>
        <Header text={'Gastos do Fixos'} />

        <Modal 
          transparent={true}
          visible={this.state.showAddCost}
          onRequestClose={() => { this.setState({showAddCost: false}); }}
        >
          <View style={{backgroundColor: '#FFF', margin: 30, padding: 5, borderRadius: 5}}>
            <View>
              <View style={styles.section}>
                <Input 
                  label={'Nome'} 
                  value={this.state.addCost.name} 
                  onChangeText={name => this.setState(
                    prevState => ({addCost: {...prevState.addCost, name: name}})
                  )}
                />
              </View>
              <View style={styles.section}>
                <Input
                  label={'Valor'} 
                  value={this.state.addCost.value} 
                  keyboardType={'numeric'}
                  onChangeText={value => this.setState(
                    prevState => ({addCost: {...prevState.addCost, value: value}})
                  )}
                />
              </View>
              <View style={styles.section}>
                <Button onPress={() => { this.setState({showAddCost: false}); }}>
                  Cancelar
                </Button>
              </View>
              <View style={styles.section}>
                <Button onPress={() => { this.addCost() }}>
                  Adicionar
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView style={{paddingTop: 5}}>
        <View>
          <Text>Total: R${total}</Text>
        </View>
        <View style={styles.costsList}>
          {this.state.fixedCosts.map((c, i) => (
            <Card key={i} text={c.name} value={c.value} onPress={() => this.onPressCostCard(c, i) } />
          ))}
          <Card key={'add'} text={'Adicionar'} value={'+'} onPress={() => this.onPressAddCost() } />
        </View>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  costsList: {
    marginTop: 25, 
    flex:1, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    flexWrap: 'wrap'
  },
  section: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
});
