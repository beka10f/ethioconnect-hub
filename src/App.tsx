import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Jobs from "@/pages/Jobs";
import Rentals from "@/pages/Rentals";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import PostJob from "@/pages/PostJob";
import PostRental from "@/pages/PostRental";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/post-rental" element={<PostRental />} />
      </Routes>
    </Router>
  );
}

export default App;