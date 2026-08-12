import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingLayout from "./layouts/LandingLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Help from "./pages/Help";
import FindWork from "./pages/FindWork";
import Dashboard from "./pages/Dashboard";
import FreelancerProfile from "./pages/FreelancerProfile.jsx";
import JobDetail from "@/pages/JobDetail.jsx";
import Freelancers from "@/pages/Freelancers.jsx";
import Logout from "@/pages/Logout.jsx";
import ClientProfile from "@/pages/ClientProfile.jsx";
import PostJob from "@/pages/PostJob.jsx";
import TermsOfService from "@/pages/TermsOfService.jsx";
import Privacy from "@/pages/Privacy.jsx";
import About from "@/pages/About.jsx";
import Contact from "@/pages/Contact.jsx"; // <-- Added missing Contact import

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingLayout />} />

                <Route path="/jobs/:jobId" element={<JobDetail />} />

                <Route path="/freelancers" element={<Freelancers />} />

                <Route path="/jobs" element={<FindWork />} />

                <Route path="/login" element={<Login />} />

                <Route path="/logout" element={<Logout />} />

                <Route path="/register" element={<Register />} />

                <Route path="/help" element={<Help />} />

                <Route path="/post-job" element={<PostJob />} />

                <Route path="/jobs/:jobId/edit" element={<PostJob />} />

                <Route path="/client-dashboard" element={<ClientDashboard />}/>

                <Route path="/freelancerdashboard/*" element={<FreelancerDashboard />} />

                <Route path="/dashboard/*" element={<Dashboard />} />

                <Route path="/freelancer/:slug" element={<FreelancerProfile />} />

                <Route path="/client/:slug"  element={<ClientProfile />} />

                <Route path="/terms" element={<TermsOfService />} /> {/* <-- Fixed missing '=' */}

                <Route path="/privacy" element={<Privacy />} />

                <Route path="/contact" element={<Contact />} />

                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App;