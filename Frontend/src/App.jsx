import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from './layouts/LandingLayout'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register";
import Footer from './components/layout/Footer';
import FreelancerProfile from './pages/FreelancerProfile';
import ClientDashboard from "./pages/ClientDashboard";
import Help from "./pages/Help";



function App() {
  const [count, setCount] = useState(0)

  return (
    <><Router>
      <Routes>
        <Route path='/' element={<LandingLayout/>}></Route>
        <Route path='/freelancerProfile' element={<FreelancerProfile/>}></Route>
         <Route path='/login' element={<Login />} />
         <Route path="/register" element={<Register/>} />
          <Route path="/help" element={<Help/>} />
            <Route
          path="/client-dashboard"
          element={<ClientDashboard />}
        />

      </Routes>
    </Router>
    {/* <Footer/> */}
    </>
  )
}

export default App
