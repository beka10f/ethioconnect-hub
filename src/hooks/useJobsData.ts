import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type JobStatus = 'pending' | 'approved' | 'rejected';

export type Job = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  contact_info: string;
  phone_number: string;
  status: string;
  created_at: string;
};

export const useJobsData = (status: JobStatus) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Set up real-time subscription filtered by status
    const channel = supabase
      .channel(`jobs-${status}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: `status=eq.${status}`
        },
        (payload) => {
          console.log(`Job ${payload.eventType}:`, payload);
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status]);

  return { jobs, isLoading, refetch: fetchJobs };
};