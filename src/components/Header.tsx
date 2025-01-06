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
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-medium text-site-black tracking-tight">
            Ethiopian DMV Hub
          </Link>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-site-black/70">
              {[
                { to: "/jobs", label: "Jobs" },
                { to: "/rentals", label: "Rentals" },
                { to: "/", label: "Exchange Rate" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="hover:text-site-blue transition-colors duration-200 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-site-blue after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {isLoggedIn ? (
              <Button 
                variant="outline"
                className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white transition-colors duration-200 shadow-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white transition-colors duration-200 shadow-sm"
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