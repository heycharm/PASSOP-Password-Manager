import { useState } from 'react' 
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'
import Resgistrationform from './components/Resgistrationform'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loginform from './components/Loginform'

function App() { 

  return (
    <>
    <Navbar /> 
    <Router>
      <Routes>
        <Route path="/" element={ <Loginform />}/>
        <Route path="/login" element={ <Loginform />}/>
        <Route path="/registration" element={ <Resgistrationform />}/>
        <Route path="/main" element={ <Manager/>}/>
       
        {/* <div className="bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"> */}

       {/* <Manager/>  */}
        {/* </div> */}
       
       </Routes>
       </Router>
       <Footer/>
    </>
  )
}

export default App