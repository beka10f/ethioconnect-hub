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
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-medium text-gray-900 tracking-tight">
            Ethiopian DMV Hub
          </Link>
          <div className="flex items-center space-x-8">
            <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
              {[
                { to: "/jobs", label: "Jobs" },
                { to: "/rentals", label: "Rentals" },
                { to: "/", label: "Exchange Rate" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="hover:text-blue-600 transition-colors duration-200 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {isLoggedIn ? (
              <Button 
                variant="outline"
                className="border-ethiopian-coffee text-ethiopian-coffee hover:bg-ethiopian-coffee hover:text-white transition-colors duration-200 shadow-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-ethiopian-coffee text-ethiopian-coffee hover:bg-ethiopian-coffee hover:text-white transition-colors duration-200 shadow-sm"
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