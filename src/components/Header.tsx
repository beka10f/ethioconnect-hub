import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link to="/" className="text-2xl font-medium text-gray-900 tracking-tight">
            Ethiopian DMV Hub
          </Link>
          <div className="flex items-center gap-8">
            <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
              <Link to="/jobs" className="hover:text-blue-600 transition-colors duration-200">Jobs</Link>
              <Link to="/rentals" className="hover:text-blue-600 transition-colors duration-200">Rentals</Link>
              <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Business Directory</Link>
              <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Exchange Rate</Link>
              <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Calendar</Link>
              <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Contact</Link>
            </nav>
            {isLoggedIn ? (
              <Button 
                variant="outline"
                className="border-ethiopian-coffee text-ethiopian-coffee hover:bg-ethiopian-coffee hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-ethiopian-coffee text-ethiopian-coffee hover:bg-ethiopian-coffee hover:text-white"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;