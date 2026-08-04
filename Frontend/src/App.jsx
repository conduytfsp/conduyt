import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingLayout from "./layouts/LandingLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Help from "./pages/Help";
import FindWork from "./pages/FindWork";

function App() {
  return (
    <Router>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<LandingLayout />} />

        {/* Find Work Page */}
        <Route path="/find-work" element={<FindWork />} />

        {/* Other Pages */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/help" element={<Help />} />

        <Route
          path="/client-dashboard"
          element={<ClientDashboard />}
        />
        {/* Freelancer Page */}
         <Route path="/freelancerdashboard/*" element={<FreelancerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;