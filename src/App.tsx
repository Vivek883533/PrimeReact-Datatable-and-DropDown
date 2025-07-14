
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import axios from "axios";
import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css";
import "./index.css"
import { FC, useEffect, useState } from 'react';


interface Country {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  countryId: string;
}

interface StateWithCountry {
  id: string;
  stateName: string;
  countryName: string;
}

const App: FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [stateWithCountry, setStateWithCountry] = useState<StateWithCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);


  const tenatId = "ho";

  useEffect(() => {
    axios.get('API_URL', {
      params: { tenatId },
    })
      .then(response => {
        setCountries(response.data);
        if (response.data.length > 0) {
          setSelectedCountry(response.data[0]);
        }
      })
      .catch(error => console.log(error));

  }, [tenatId]);

  useEffect(() => {
    axios.get('API_URL', {
      params: { tenatId },
    })
      .then(response => {
        setStates(response.data);
        if (response.data.length > 0) {
          setSelectedState(response.data[0]);
        }
      })
      .catch(error => console.log(error));

  }, [tenatId]);

  useEffect(() => {
    if (selectedCountry) {
      axios.post('API_URL', { tenatId, countryId: selectedCountry.id })
        .then(response => {
          const stateWithCountryData = response.data.map((state: State) => ({
            id: state.id,
            stateName: state.name,
            countryName: selectedCountry.name,
          }));
          setStateWithCountry(stateWithCountryData);
          setStates(response.data);
        })
        .catch(error => console.log(error)
        );
    } else {
      setStates([]);
      setStateWithCountry([]);
    }
  }, [selectedCountry, tenatId]);



  return (
    <div className='p-6'>
      <div className="mb-4">
        <Dropdown
          value={selectedCountry}
          options={countries}
          onChange={(e: DropdownChangeEvent) => setSelectedCountry(e.value)}
          optionLabel='name'
          placeholder='Select a Country'
          className='w-full md:w-20rem'
        />
        <Dropdown
          value={selectedState}
          options={states}
          onChange={(e: DropdownChangeEvent) => setSelectedState(e.value)}
          optionLabel='name'
          placeholder='Select a State'
          className='w-full md:2-20rem mt-5'
        />
      </div>
      <div className="mt-4 p-4 border">
        <h3 className="font-bold">Selected Values</h3>
        <p><strong>Country:</strong> {selectedCountry?.name || 'None'}</p>
        <p><strong>State:</strong> {selectedState?.name || 'None'}</p>
      </div>
    </div>

  )
}

export default App;