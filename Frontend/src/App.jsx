import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingLayout from "./layouts/LandingLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FreelancerProfile from "./pages/FreelancerProfile";
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
        <Route path="/freelancerProfile" element={<FreelancerProfile />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/help" element={<Help />} />

        <Route
          path="/client-dashboard"
          element={<ClientDashboard />}
        />

      </Routes>
    </Router>
  );
}

export default App;