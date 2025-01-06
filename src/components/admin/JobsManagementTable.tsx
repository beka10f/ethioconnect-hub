import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type JobListing = {
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

interface JobsManagementTableProps {
  jobs: JobListing[];
  onJobUpdate: () => void;
  status: 'pending' | 'approved' | 'rejected';
}

const JobsManagementTable = ({ jobs, onJobUpdate, status }: JobsManagementTableProps) => {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const handleApproval = async (e: React.MouseEvent, id: string, action: "approve" | "reject") => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event bubbling
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("jobs")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        approved_by: action === "approve" ? user.id : null
      })
      .eq("id", id);

    if (error) {
      toast.error(`Failed to ${action} job`);
      return;
    }

    toast.success(`Job ${action}d successfully`);
    onJobUpdate();
    setSelectedJob(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-gray-900">Title</TableHead>
              <TableHead className="text-gray-900">Company</TableHead>
              <TableHead className="text-gray-900">Location</TableHead>
              <TableHead className="text-gray-900">Date</TableHead>
              <TableHead className="text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-blue-50/50">
                <TableCell className="font-medium text-gray-900">{job.title}</TableCell>
                <TableCell className="text-gray-700">{job.company_name}</TableCell>
                <TableCell className="text-gray-700">{job.location}</TableCell>
                <TableCell className="text-gray-700">
                  {new Date(job.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </Button>
                    {status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                          onClick={(e) => handleApproval(e, job.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={(e) => handleApproval(e, job.id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Posted by {selectedJob?.company_name} on {selectedJob?.created_at && new Date(selectedJob.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-700 mt-1">{selectedJob?.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Location</h4>
              <p className="text-gray-700 mt-1">{selectedJob?.location}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <p className="text-gray-700 mt-1">Email: {selectedJob?.contact_info}</p>
              <p className="text-gray-700">Phone: {selectedJob?.phone_number}</p>
            </div>
            {status === 'pending' && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  onClick={(e) => selectedJob && handleApproval(e, selectedJob.id, "approve")}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={(e) => selectedJob && handleApproval(e, selectedJob.id, "reject")}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobsManagementTable;