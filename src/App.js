import React, { useState , useEffect } from 'react';
import './index.css';
import axios from 'axios';

function App (){
  
  const [ countries ,setCountries ] = useState([]);
  const [ states , setStates ] = useState([]);
  const [ cities , setCities ] = useState([]);
  let  [ selectCountry , setSelectCountry  ] = useState('');
  let  [ selectState , setSelectState  ] = useState('');
  let  [ selectCity , setSelectCity  ] = useState('');

  useEffect(()=>{
    fetchCountries();      
  },[])
  
  useEffect(()=>{
    if( selectCountry ){
      fetchState(selectCountry);    
    }
    if( selectCountry && selectState ){
      fetchCity(selectCountry,selectState);
    }
        
  },[selectCountry,selectState])

  const fetchCountries = async()=>{
    try{
      
      const getCountries = await axios.get(`https://crio-location-selector.onrender.com/countries`); 
      
      console.log(getCountries);
      if( getCountries?.data && getCountries.data.length > 0  ){
        setCountries(getCountries.data);
      }
      
    }catch(err){
        if( err && err.response ){
          console.log(err.response.data.message);
        }else{
          console.log("No response from servers !!!")
        }  

    }
  }
  
  const fetchState = async(country)=>{
    
    try{
      const getState = await axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`); 
      
      console.log(getState);
      if( getState?.data && getState.data.length > 0  ){
        setStates(getState.data);
      }
      
    }catch(err){
      // console.log(response);  
      if( err && err.response ){
          console.log(err.response.data.message);

      }else{
          console.log("No response from servers !!!")
      }
      
    }
    
  }

  const fetchCity = async(country,state)=>{
    
    try{
      
      const getCity = await axios.get(` https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`); 
      
      console.log(getCity);
      if( getCity?.data && getCity.data.length > 0  ){
        setCities(getCity.data);
      }
      
    }catch(err){
        console.log(err.response);
        if( err && err.response ){
          console.log(err.response.data);
        }else{
          console.log("No response from servers !!!")
        } 
        
        setSelectState('');
        setCities([]);

    }
    
  }

  const handleOnChange = async(e)=>{
    
    const { name ,value } = e.target;

    console.log(name, " ", value);  
    // console.log(e.target[0].value)
    

    if( name === 'country' ){
      setSelectCountry(e.target[0].value === value ? '' : value ); 
      setStates([]);
      setCities([]);
      setSelectState('');
      setSelectCity(''); 
    }else if( name === 'state' ){
      setSelectState(e.target[0].value === value ? '' : value ); 
      setCities([]);
      setSelectCity('');   
    }else if( name === 'city' ){
      setSelectCity(e.target[0].value === value ? '' : value);   
    }
  
  }

  return (
    <div className="main">
        <h2>Select Location</h2>
        <div className='containerDropDown' >
          <select 
            className='countryName' 
            name="country" 
            id="countryId"
            onChange={handleOnChange}
          >
          (<option defaultChecked >Select Country</option>) 
            {
              countries.length > 0 && 
              ( 
                countries.map((values,idx)=>{
                  return ( <option key={idx} value={values} >{values}</option> )
                })     
              )  
              
            }
            

          </select>
          <select 
            className='stateName' 
            name="state" 
            id="stateId"  
            disabled={ !selectCountry ? true : false  }  
            onChange={handleOnChange}
          >
            <option defaultChecked >Select State</option>
            {
              states.length > 0 && 
              (states.map((value,idx)=>{
                 return ( <option key={idx} value={value} >{value}</option> )  
              }))
            }
          </select>
          <select 
            className='cityName' 
            name="city" 
            id="cityId"
            disabled={ !selectState || !selectCountry ? true : false  }
            onChange={handleOnChange}
          >
            <option defaultChecked>Select City</option>
            {
              cities.map((value,idx)=>{
                return ( 
                 <option key={idx} value={value} >{value}</option>
                )
              })
            }
          </select>
        </div>
        {
          selectCountry && selectState && selectCity && 
          (<p>You selected {selectCity},{selectState},{selectCountry}</p> )
        } 
    </div>
  );
}


export default App;
