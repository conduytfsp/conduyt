import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from './layouts/LandingLayout'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register";
import Footer from './components/layout/Footer';
import FreelancerProfile from './pages/FreelancerProfile';


function App() {
  const [count, setCount] = useState(0)

  return (
    <><Router>
      <Routes>
        <Route path='/' element={<LandingLayout/>}></Route>
        <Route path='/freelancerProfile' element={<FreelancerProfile/>}></Route>
         <Route path='/login' element={<Login />} />
         <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
    <Footer/>
    </>
  )
}

export default App
