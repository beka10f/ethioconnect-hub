import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Jobs from "@/pages/Jobs";
import Rentals from "@/pages/Rentals";
import PostJob from "@/pages/PostJob";
import PostRental from "@/pages/PostRental";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import JobDetails from "@/components/JobDetails";
import RentalDetails from "@/components/RentalDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/rentals/:id" element={<RentalDetails />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/post-rental" element={<PostRental />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;