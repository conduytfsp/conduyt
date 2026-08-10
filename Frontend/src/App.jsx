import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingLayout from "./layouts/LandingLayout";
import FindWork from "./pages/FindWork";
import Freelancers from "./pages/Freelancers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Help from "./pages/Help";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<LandingLayout />} />

        {/* Find Work Page */}
        <Route path="/find-work" element={<FindWork />} />

        {/* Freelancers Page */}
        <Route path="/freelancers" element={<Freelancers />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Help */}
        <Route path="/help" element={<Help />} />

        {/* Client Dashboard */}
        <Route
          path="/client-dashboard/*"
          element={<ClientDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;