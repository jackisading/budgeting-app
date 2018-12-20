import React from 'react';
import { ScrollView, FlatList, Text, View } from 'react-native';

import Header from './Header.js';
import dummyData from './dummyData.js';
import LineItem from './LineItem.js';
import styles from './App.styles.js';
import LineItemsSection from './LineItemsSection.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dayLineItems: {
        header: 'Today',
        items: [],
      },
      weekLineItems: {
        header: 'This Week',
        items: [],
      },
      monthLineItems: {
        header: 'This Month',
        items: [],
      },
    }

    this.getStartOfDay = this.getStartOfDay.bind(this);
    this.getStartOfWeek = this.getStartOfWeek.bind(this);
    this.getStartOfMonth = this.getStartOfMonth.bind(this);
  }
  getStartOfDay() {
    let currTime = new Date();
    currTime.setHours(0);
    currTime.setMinutes(0);
    currTime.setSeconds(0);
    currTime.setMilliseconds(0);
    return currTime.getTime();
  }
  getStartOfWeek() {
    let currTime = new Date(this.getStartOfDay());
    currTime.setDate(currTime.getDate() - 7);
    return currTime.getTime();
  }
  getStartOfMonth() {
    let currTime = new Date(this.getStartOfDay());
    currTime.setMonth(currTime.getMonth() - 1);
    return currTime.getTime();
  }
  componentWillMount() {
    const data = Object.values(dummyData).map(x => JSON.parse(x)).sort((a,b) => a.timestamp <= b.timestamp);
    const newState = {...this.state};

    const dayTime = this.getStartOfDay();
    const weekTime = this.getStartOfWeek();
    const monthTime = this.getStartOfMonth();

    newState.dayLineItems.items = data.filter(x => x.timestamp >= dayTime);
    newState.weekLineItems.items = data.filter(x => x.timestamp >= weekTime && x.timestamp < dayTime);
    newState.monthLineItems.items = data.filter(x => x.timestamp >= monthTime && x.timestamp < weekTime);
    this.setState({newState});
  }
  render() {
    return (
      <ScrollView 
        showsVerticalScrollIndicator='False'>

          <LineItemsSection
            data = {this.state.dayLineItems}
          />
          <LineItemsSection
            data = {this.state.weekLineItems}
          />
          <LineItemsSection
            data = {this.state.monthLineItems}
          />                    

      </ScrollView>
    );
  }
}
