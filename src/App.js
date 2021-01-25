
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
const find = {
  Project: project,
  _TypeHierarchy:type,
  ScheduleState:"In-Progress",
  "_PreviousValues.ScheduleState":"Defined",
  _ValidFrom: {"$gte":gte,"$lt":lt}
}

const API = `https://rally1.rallydev.com/analytics/v2.0/service/rally/workspace/${workspace}/artifact/snapshot/query.js?find=`;
const QUERY = `${JSON.stringify(find)}`;
const url = `${API}${QUERY}`
const apiKey = process.env.REACT_APP_APIKEY;

console.log(`url: ${url}`)

class App extends Component {
  state = {
    items: [],
    isLoading: false
  } 
  
  async componentDidMount(){
    this.setState({ isLoading: true });
    try {
      const result = await axios.get(url, {
        headers: {
          'zsessionid': apiKey, 
          'Content-Type': 'application/json'
        }
      });
 
      this.setState({
        items: result.data['Results'],
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
        <LineRechart items={this.state.items}/>
      </div>
    );
  }
}

export default App;

