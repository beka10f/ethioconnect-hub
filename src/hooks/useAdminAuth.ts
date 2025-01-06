import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please log in to access the admin panel");
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          toast.error("You don't have permission to access the admin panel");
          navigate("/");
          return;
        }

        setIsAuthChecked(true);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Authentication error");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return { isAuthChecked };
};