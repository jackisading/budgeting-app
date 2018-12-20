import React from 'react';
import { ScrollView, SectionList, Button, FlatList, Text, View } from 'react-native';

import Header from './Header.js';
import dummyData from './dummyData.js';
import LineItem from './LineItem.js';
import styles from './App.styles.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dayLineItems: {
        header: 'Today',
        total: 'nah',
        items: [],
      },
      weekLineItems: {
        header: 'This Week',
        total: 'nah',
        items: [],
      },
      monthLineItems: {
        header: 'This Month',
        total: 'nah',
        items: [],
      },
    }

    this.getStartOfDay = this.getStartOfDay.bind(this);
    this.getStartOfWeek = this.getStartOfWeek.bind(this);
    this.getStartOfMonth = this.getStartOfMonth.bind(this);

    this.getSum = this.getSum.bind(this);
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
  getSum(items) {
    return `$${items.length == 0 ? 0 : items.map(x=>parseFloat(x.cost)).reduce((a,c) => { return a+c}).toFixed(2)}`;
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

    newState.dayLineItems.total = this.getSum(newState.dayLineItems.items);
    newState.weekLineItems.total = this.getSum(newState.weekLineItems.items);
    newState.monthLineItems.total = this.getSum(newState.monthLineItems.items);

    this.setState({newState});
  }
  render() {
    return (
      <View>
        <SectionList
          style = {styles.listContainer}
          stickySectionHeadersEnabled = 'True'
          renderItem={({item, index, section}) => (
            <LineItem
              category={item.category}
              store={item.store}
              cost={item.cost}
              time={item.timestamp}
            />
          )}
          renderSectionHeader={({section: {title, total}}) => (
            <Header
              title={title}
              total={total}
            />
          )}
          sections={[
            {title: this.state.dayLineItems.header, total:this.state.dayLineItems.total, data: this.state.dayLineItems.items},
            {title: this.state.weekLineItems.header, total:this.state.weekLineItems.total, data: this.state.weekLineItems.items},
            {title: this.state.monthLineItems.header, total:this.state.monthLineItems.total, data: this.state.monthLineItems.items},
          ]}
          keyExtractor={(item, index) => item + index}
        />

        <Button
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}
