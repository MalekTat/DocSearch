import '../styles/Searchbar.css'

import React, { useState, useEffect, useMemo } from 'react';
import {Link,  useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faStethoscope } from "@fortawesome/free-solid-svg-icons"

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import _ from 'lodash'; // Import lodash

import { useSearchContext } from '../context/SearchContext';

const Searchbar = () => {
  const searchListPage  = useLocation();
  console.log(searchListPage)
  const { searchState, setSearchState } = useSearchContext();
  console.log(searchState)

  const [allOptions, setAllOptions] = useState([]); // Store all options from the API
  const [filteredOptions, setFilteredOptions] = useState([]); // Store options filtered by user input
  const [searchTerm, setSearchTerm] = useState(''); // Store the user's input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [allOptionsCity, setAllOptionsCity] = useState([]); // Store all options from the API
  const [filteredOptionsCity, setFilteredOptionsCity] = useState([]); // Store options filtered by user input
  const [searchTermCity, setSearchTermCity] = useState(''); // Store the user's input
  const [loadingCity, setLoadingCity] = useState(false);
  const [errorCity, setErrorCity] = useState(null);




  // specialty
  // Fetch all data from the API
  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('http://localhost:5005/doctors/');
      const dupoptions = data ? data.map((item) => item.specialty) : [];
      const options  = [...new Set(dupoptions)];
      setAllOptions(options);
      setFilteredOptions(options); // Initially show all options
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
    fetchData();
  }, []);



  // Debounced function for filtering
  const debouncedFilter = useMemo(
    () =>
      _.debounce((value) => {
        if (value) {
          const filtered = allOptions.filter((option) =>
            option.toLowerCase().includes(value.toLowerCase())
          );
          setFilteredOptions(filtered);
        } else {
          setFilteredOptions(allOptions); // Show all options if input is empty
        }
      }, 1000), // Adjust debounce delay as needed
    [allOptions]
  );

  // Handle input changes
  const handleInputChange = (e, value) => {
    //setSearchTerm(value);
    setSearchState((prevstate) => ({ ...prevstate, specialty: value }));
    debouncedFilter(value); // Use the debounced function
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFilter.cancel(); // Cancel pending debounced calls
    };
  }, [debouncedFilter]);





  // City Search Bar
  // Fetch all data from the API
  useEffect(() => {
    const fetchDataCity = async () => {
      setLoadingCity(true);
      setErrorCity(null);
      try {
        const { data } = await axios.get('http://localhost:5005/doctors/');
        const dupoptions = data ? data.map((item) => item.city) : [];
        const options  = [...new Set(dupoptions)];
        setAllOptionsCity(options);
        setFilteredOptionsCity(options); // Initially show all options
      } catch (err) {
        setErrorCity("Failed to fetch data. Please try again.");
      } finally {
        setLoadingCity(false);
      }
    };
      fetchDataCity();
    }, []);
  
  
  
    // Debounced function for filtering
    const debouncedFilterCity = useMemo(
      () =>
        _.debounce((value) => {
          if (value) {
            const filteredCity = allOptionsCity.filter((option) =>
              option.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptionsCity(filteredCity);
          } else {
            setFilteredOptionsCity(allOptionsCity); // Show all options if input is empty
          }
        }, 300), // Adjust debounce delay as needed
      [allOptionsCity]
    );
  
    // Handle input changes
    const handleInputChangeCity = (e, value) => {
      //setSearchTermCity(value);
      setSearchState((prevstate) => ({ ...prevstate, city: value }));
      debouncedFilterCity(value); // Use the debounced function
    };
  
    // Cleanup debounce on unmount
    useEffect(() => {
      return () => {
        debouncedFilterCity.cancel(); // Cancel pending debounced calls
      };
    }, [debouncedFilterCity]);



  return (
    <div className={`${searchListPage.pathname === '/search-result' ? "search-bar-result" : "search-bar"}`} >
          {!loading && !error && (
          <Autocomplete
            className='search-specialty'
        
            freeSolo
            autoComplete
            autoHighlight
            getOptionLabel={(option) => (typeof option === 'string' ? option : String(option))}
            value={searchState.specialty}
            options={filteredOptions}
            onInputChange={handleInputChange} // Trigger debounced filtering
            renderInput={(params) => (
              <TextField
                {...params}
                
                variant="outlined"
                placeholder="Type specialty"

                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "inherit", // Inherit the border-radius from the CSS class
                    borderRadius: "25px 0px 0px 25px",
                    height: "100%", // Ensures it fills the parent container's height
                    padding: "0", // Removes internal padding
                    margin: "0",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    backgroundColor: "#e0f7fa", // Light blue background when focused
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px", // Ensure proper text padding
                  },
                }}
              />
            )}
            sx={{
              height:"100%",
              borderRadius: "25px 0px 0px 25px",
              margin: "0",
              border : "0",
              padding : "0",
              "& .MuiAutocomplete-popupIndicator": {
                color: "blue", // Style the dropdown arrow
              },
              "& .MuiAutocomplete-clearIndicator": {
                color: "red", // Style the clear (x) button
              },
            }}
            
          />
          )}

          {!loadingCity && !errorCity && (
          <Autocomplete
            className='search-city'
            freeSolo
            autoComplete
            autoHighlight
            getOptionLabel={(option) => (typeof option === 'string' ? option : String(option))}
            value={searchState.city}
            options={filteredOptionsCity}
            onInputChange={handleInputChangeCity} // Trigger debounced filtering
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Type your City"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "100%", // Ensures it fills the parent container's height
                    padding: "0", // Removes internal padding
                    margin: "0",
                    border : "0"
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px", // Ensure proper text padding
                  },
                }}
              />
            )}
            sx={{
              height:"100%",
              margin: "0",
              border : "0",
              padding : "0",
              "& .MuiAutocomplete-popupIndicator": {
                color: "blue", // Style the dropdown arrow
              },
              "& .MuiAutocomplete-clearIndicator": {
                color: "red", // Style the clear (x) button
              },
            }}
          />
          )}
          
          <Link to={'/search-result'} className='search-button-container'><button className="search-button1"><FontAwesomeIcon icon={faStethoscope} size="2xl" /></button></Link>     
    </div>
  )
}

export default Searchbar