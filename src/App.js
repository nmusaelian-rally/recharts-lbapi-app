import { useState } from 'react';
import MultiSelect from 'react-multi-select-component'; //npm i react-multi-select-component
import Rally from './components/Rally';

function App () {

const options = [
    {label: 'In-Progress', value: 'In-Progress'},
    {label: 'Released', value: 'Released'},
];

const [selected, setSelected] = useState([]);

  return (
      <div className="App">
        <div className="container">
        <div>
            <h4>Select State</h4>
            <MultiSelect
                options={options}
                value={selected}
                onChange={setSelected}
                labelledBy="Select"
                />
        </div>
          <Rally selected={selected}/>
        </div>
      </div>
    );
}

export default App;

