
import React, { Component } from 'react';
import LineRechart from './components/LineRechart';
import axios from 'axios';

/*
https://rally1.rallydev.com/analytics/v2.0/service/rally/workspace/41529001/artifact/snapshot/query.js?find={"Project":332322441800,"_TypeHierarchy":"HierarchicalRequirement","ScheduleState"
: "In-Progress", "_PreviousValues.ScheduleState": "Defined","_ValidFrom": { "$gte": "2021-01-01", "$lt": "2021-01-31"}}&fields=["ObjectID","_ValidFrom","_ValidTo","FormattedID","ScheduleState","_PreviousValues.ScheduleState"]&hydrate=["ScheduleState","_PreviousValues.ScheduleState"]&compress=true
*/

const workspace = 41529001;
const project = 332322441800;
const type = 'HierarchicalRequirement';
const gte = '2020-01-01';
const lt =  '2021-01-01';

const findInProgress = {
  Project: project,
  _TypeHierarchy:type,
  ScheduleState:"In-Progress",
  "_PreviousValues.ScheduleState":"Defined",
  _ValidFrom: {"$gte":gte,"$lt":lt}
}

const findReleased = {
  Project: project,
  _TypeHierarchy:type,
  ScheduleState:"Released",
  "_PreviousValues.ScheduleState":"Accepted",
  _ValidFrom: {"$gte":gte,"$lt":lt}
}

const fields = [
  '"ObjectID"',
  '"_ValidFrom"',
  '"_ValidTo"',
  '"ScheduleState"',
  '"_PreviousValues.ScheduleState"'
];

const hydrate = ['"ScheduleState"','"_PreviousValues.ScheduleState"'];

const api = `https://rally1.rallydev.com/analytics/v2.0/service/rally/workspace/${workspace}/artifact/snapshot/query.js?find=`;
const queryInProgress = `${JSON.stringify(findInProgress)}`;
const queryReleased = `${JSON.stringify(findReleased)}`;
const url1 = `${api}${queryInProgress}&fields=[${fields}]&hydrate=[${hydrate}]`;
const url2 = `${api}${queryReleased}&fields=[${fields}]&hydrate=[${hydrate}]`;

console.log(`url1: ${url1}`);
const apiKey = process.env.REACT_APP_APIKEY;

class App extends Component {
  state = {
    inProgress: [],
    released: [],
    isLoading: false
  } 
  
  async componentDidMount(){
    this.setState({ isLoading: true });
    const headers = {
      'zsessionid': apiKey, 
      'Content-Type': 'application/json'
    }
    try {
      const result = await axios.all([
        axios.get(url1, {headers: headers}),
        axios.get(url2, {headers: headers})
      ]);
 
      this.setState({
        inProgress: result[0].data['Results'],
        released:   result[1].data['Results'],
        isLoading: false
      });
    } catch (error) {
        console.log(error);
        this.setState({
          isLoading: false
        });
    }
  }

  render() {
 
    if (this.state.isLoading) {
      return <div>Loading.. please wait!</div>
    }
    return (
      <div className="App">
        <h2>Title goes here</h2>
        <LineRechart items={[this.state.inProgress, this.state.released]}/>
      </div>
    );
  }
}

export default App;

