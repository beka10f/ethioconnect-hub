import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_OUT') {
            setIsLoggedIn(false);
            // Clear any stored tokens
            supabase.auth.signOut();
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setIsLoggedIn(!!session);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error logging out");
    }
  };

  const handleShipToEthiopia = () => {
    if (location.pathname !== "/") {
      navigate("/?section=shipping");
    } else {
      // If already on home page, scroll to shipping section
      const shippingSection = document.getElementById("shipping-calculator");
      if (shippingSection) {
        shippingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const navigationLinks = [
    { to: "/jobs", label: "Jobs" },
    { to: "/rentals", label: "Rentals" },
    { to: "/", label: "Exchange Rate" },
    { label: "Ship to Ethiopia", onClick: handleShipToEthiopia },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl sm:text-2xl font-medium text-site-black tracking-tight">
            Ethiopian DMV Hub
          </Link>
          
          <div className="flex items-center space-x-4 sm:space-x-8">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-site-black/70">
              {navigationLinks.map((link) => (
                link.onClick ? (
                  <button
                    key={link.label}
                    onClick={link.onClick}
                    className="relative text-site-black/70 active:text-site-blue transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-site-blue after:transition-all active:after:w-full md:hover:text-site-blue md:hover:after:w-full"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="relative text-site-black/70 active:text-site-blue transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-site-blue after:transition-all active:after:w-full md:hover:text-site-blue md:hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navigationLinks.map((link) => (
                      link.onClick ? (
                        <button
                          key={link.label}
                          onClick={link.onClick}
                          className="text-lg font-medium text-site-black/70 active:text-site-blue transition-colors px-2 py-1 text-left"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          key={link.label}
                          to={link.to}
                          className="text-lg font-medium text-site-black/70 active:text-site-blue transition-colors px-2 py-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {isLoggedIn ? (
              <Button 
                variant="outline"
                className="border-site-blue text-site-blue active:bg-site-blue active:text-white md:hover:bg-site-blue md:hover:text-white transition-colors duration-200 shadow-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-site-blue text-site-blue active:bg-site-blue active:text-white md:hover:bg-site-blue md:hover:text-white transition-colors duration-200 shadow-sm"
                onClick={() => navigate("/login")}
              >
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Log in</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;