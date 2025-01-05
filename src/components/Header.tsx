import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-ethiopian-coffee text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Ethiopian DMV Hub</h1>
        <nav className="flex flex-wrap gap-6 text-sm">
          <Link to="/" className="hover:text-ethiopian-gold transition-colors">Jobs</Link>
          <Link to="/" className="hover:text-ethiopian-gold transition-colors">Rentals</Link>
          <Link to="/" className="hover:text-ethiopian-gold transition-colors">Business Directory</Link>
          <Link to="/" className="hover:text-ethiopian-gold transition-colors">Exchange Rate</Link>
          <Link to="/" className="hover:text-ethiopian-gold transition-colors">Calendar</Link>
          <Link to="/" className="hover:text-ethiopian-gold transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;