import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRentalApproval = (onSuccess?: () => void) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApproval = async (id: string, action: "approve" | "reject") => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to perform this action');
        return;
      }

      const { error } = await supabase.rpc('approve_rental', {
        rental_id: id,
        admin_id: user.id,
        action: action
      });

      if (error) {
        console.error('Update error:', error);
        toast.error(`Failed to ${action} rental: ${error.message}`);
        return;
      }

      toast.success(`Rental ${action}d successfully`);
      onSuccess?.();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleApproval, isUpdating };
};