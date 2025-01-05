import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link to="/" className="text-2xl font-medium text-gray-900 tracking-tight">
            Ethiopian DMV Hub
          </Link>
          <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/jobs" className="hover:text-blue-600 transition-colors duration-200">Jobs</Link>
            <Link to="/rentals" className="hover:text-blue-600 transition-colors duration-200">Rentals</Link>
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Business Directory</Link>
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Exchange Rate</Link>
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Calendar</Link>
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;