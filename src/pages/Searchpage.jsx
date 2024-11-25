import React from 'react'
import '../styles/SearchPage.css'
import Searchbar from '../components/Searchbar'
import DoctorsList from '../components/DoctorsList'

const Searchpage = () => {
  return (
    <div className='search-page' >
      <div className='search-bar-container'><Searchbar /></div>
      
      <div className='doctor-list-search'><DoctorsList /></div>
    </div>
    
  )
}

export default Searchpage