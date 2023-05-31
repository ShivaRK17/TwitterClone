import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap"
import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import About from './components/About'
import Home from './components/Home'
import Profile from './components/Profile'
import Signup from './components/Signup'
import Login from './components/Login'
import Error from './components/Error';

const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/TwitterClone" element={<Home/>}/>
      <Route path="/TwitterClone/about" element={<About/>}/>
      <Route path="/TwitterClone/profile/:id" element={<Profile/>}/>
      <Route path="/TwitterClone/signup" element={<Signup/>}/>
      <Route path="/TwitterClone/login" element={<Login/>}/>
      <Route path='/TwitterClone/*' element={<Error/>}/>
    </Routes>

    </>
  )
}

export default App