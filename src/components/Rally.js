import useFetch from "../fetch/use-fetch";
import LineRechart from "./LineRechart";
import { useState, useEffect } from "react";


const Rally = ({selected}) => {
    const [rallyData, setRallyData] = useState([]);
    const {loading, error, makeRequest: makeLookbackApiRequest} = useFetch();
    console.log('reloaded Rally', selected);
    useEffect(()=>{
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
        const packageRallyData = (rallyData) => {
            const snapshots = []
            for (const key in rallyData){
                snapshots.push(rallyData[key])
            }
            setRallyData(snapshots)
        };
        makeLookbackApiRequest(
            {urls: [url1, url2], headers: headers},
            packageRallyData
        )
    },[makeLookbackApiRequest])
    return (
        <div className="App">
          <div className="container">
            {loading && <div className="loader">Loading...</div>}
            {error && <div className="error">OH, NOES!!!</div>}
            <h3>Story count per month by state transition</h3>
            <LineRechart items={rallyData}/>
          </div>
        </div>
      );
  }
export default Rally;