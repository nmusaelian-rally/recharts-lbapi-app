
//import React, { Component } from 'react';
import React, { useState, useEffect } from 'react';
import LineRechart from './components/LineRechart';
import axios from 'axios';

/*
https://rally1.rallydev.com/analytics/v2.0/service/rally/workspace/41529001/artifact/snapshot/query.js?find={"Project":332322441800,"_TypeHierarchy":"HierarchicalRequirement","ScheduleState"
: "In-Progress", "_PreviousValues.ScheduleState": "Defined","_ValidFrom": { "$gte": "2021-01-01", "$lt": "2021-01-31"}}&fields=["ObjectID","_ValidFrom","_ValidTo","FormattedID","ScheduleState","_PreviousValues.ScheduleState"]&hydrate=["ScheduleState","_PreviousValues.ScheduleState"]&compress=true
*/



const useFetch = (url1, url2, headers, initState) => {
  const [data, setData] = useState(initState);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    const fetchData = async () => {
      try{
        setLoading(true);
        const result = await axios.all([
          axios.get(url1, {headers: headers}),
          axios.get(url2, {headers: headers})
        ]);
        console.log(result);
        setData({
          inProgress: result[0].data['Results'],
          released:   result[1].data['Results']
        });
      } catch(error){
        throw(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  },[]
)
  return { loading, data }
}

function App () {
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

  const apiKey = process.env.REACT_APP_APIKEY;
  const headers = {
    'zsessionid': apiKey, 
    'Content-Type': 'application/json'
  }
  const initState = {
    inProgress: [],
    released: [],
  }

  const { loading, data } = useFetch(url1, url2, headers, initState);
  return (
      <div className="App">
        <div className="container">
          {loading && <div className="loader">Loading...</div>}
          <h3>Story count per month by state transition</h3>
          <LineRechart items={[data.inProgress, data.released]}/>
        </div>
      </div>
    );
}

export default App;

