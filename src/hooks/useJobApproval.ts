import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useJobApproval = (onSuccess?: () => void) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApproval = async (id: string, action: "approve" | "reject", retryCount = 0) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to perform this action');
        return;
      }

      const { error } = await supabase
        .from("jobs")
        .update({
          status: action === "approve" ? "approved" : "rejected",
          approved_by: action === "approve" ? user.id : null
        })
        .eq("id", id);

      if (error) {
        console.error('Update error:', error);
        
        if (retryCount < MAX_RETRIES && (error.message.includes('Failed to fetch') || error.message.includes('network'))) {
          setIsUpdating(false);
          toast.error(`Network error, retrying... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return handleApproval(id, action, retryCount + 1);
        }
        
        toast.error(`Failed to ${action} job: ${error.message}`);
        return;
      }

      toast.success(`Job ${action}d successfully`);
      onSuccess?.();
    } catch (error) {
      console.error('Unexpected error:', error);
      
      if (retryCount < MAX_RETRIES && error instanceof Error && error.message.includes('Failed to fetch')) {
        setIsUpdating(false);
        toast.error(`Network error, retrying... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return handleApproval(id, action, retryCount + 1);
      }
      
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleApproval, isUpdating };
};