
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import "./reset.css"
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'
import Login from './pages/Login';
import Searchpage from './pages/Searchpage';
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext';
import DoctorDetail from './pages/DoctorDetail';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';


function App() {
  

  return (
    <>

      <AuthProvider>  
        <Navbar />
      
        <Footer />

        <SearchProvider>
          <Routes>
				    <Route path='/' element={<Homepage />} />
				    <Route path='/login' element={<Login />} />
            <Route path='/search-result' element={<Searchpage />} />
            <Route path="/doctor/:id" element={<DoctorDetail />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/doctor" element={<DoctorPage />} />
			    </Routes>
        </SearchProvider>
      </AuthProvider>
      
    </>
  )
}

export default App
