import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from './layouts/LandingLayout'
import Home from './pages/Home';
import Login from './pages/Login';


function App() {
  const [count, setCount] = useState(0)

  return (
    <><Router>
      <Routes>
        <Route path='/' element={<LandingLayout/>}></Route>
         <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
