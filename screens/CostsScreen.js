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
import { $border, $clear_background } from '../styles/colors.js';

const DOUBLE_PRESS_DELAY = 300;

export class CostsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.props.screenProps.handleRemoveCost(cost, index);
  }

  onPressAddCost() {
    this.setState({showAddCost: true});
  }

  addCost() {
    this.setState({showAddCost: false});
    this.props.screenProps.handleAddCost(this.state.addCost);
  }

  showModalAddCosts(show) {
    this.setState({showAddCost: show});
  }

  render() {
    const total = this.props.screenProps.monthlyExpenses
      .map(c => c.value)
      .reduce((p, c) => { return p + c }, 0)
      .toFixed(2);

    return (
      <Screen style={styles.screen}>
        <Header text={'Dívidas'} />
        <View style={styles.total}>
          <Card text={'Total'} value={total} height={58} />
        </View>
        <Modal
          transparent={true}
          visible={this.state.showAddCost}
          onRequestClose={() => { this.setState({showAddCost: false}); }}
        >
          <View style={styles.modalBody}>
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

        <ScrollView style={styles.spacing}>
          <View style={styles.costsList}>
            {this.props.screenProps.monthlyExpenses.map((c, i) => (
              <Card key={i} text={c.name} value={c.value} onPress={() => this.onPressCostCard(c, i) } />
            ))}
            <Card text={'Adicionar'} value={'+'} onPress={() => this.onPressAddCost() } />
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
    backgroundColor: $clear_background,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: $border,
    position: 'relative'
  },
  screen: {flex:1, flexDirection: 'column'},
  modalBody: {backgroundColor: $clear_background, margin: 30, padding: 5, borderRadius: 5},
  spacing: {padding: 5},
  total: {
    position: 'absolute',
    top: 85
  }
});
