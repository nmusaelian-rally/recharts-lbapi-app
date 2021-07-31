import useFetch from "../fetch/use-fetch";
import LineRechart from "./LineRechart";


const Rally = () => {
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
export default Rally;