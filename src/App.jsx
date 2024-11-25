
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



function App() {
  

  return (
    <>
      
      <Navbar />
      
      <Footer />

      <SearchProvider>
      <Routes>
				<Route path='/' element={<Homepage />} />
				<Route path='/login' element={<Login />} />
        <Route path='/search-result' element={<Searchpage />} />
			</Routes>
      </SearchProvider>
      
    </>
  )
}

export default App
