import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type JobListing = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  status: string;
  created_at: string;
};

interface PendingJobsTableProps {
  pendingJobs: JobListing[];
  onJobUpdate: () => void;
}

const PendingJobsTable = ({ pendingJobs, onJobUpdate }: PendingJobsTableProps) => {
  const handleApproval = async (id: string, action: "approve" | "reject") => {
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
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-ethiopian-sage/20">
      <Table>
        <TableHeader className="bg-ethiopian-coffee/5">
          <TableRow>
            <TableHead className="text-ethiopian-coffee">Title</TableHead>
            <TableHead className="text-ethiopian-coffee">Company</TableHead>
            <TableHead className="text-ethiopian-coffee">Location</TableHead>
            <TableHead className="text-ethiopian-coffee">Date</TableHead>
            <TableHead className="text-ethiopian-coffee">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingJobs.map((job) => (
            <TableRow key={job.id} className="hover:bg-ethiopian-cream/20">
              <TableCell className="font-medium text-ethiopian-coffee">{job.title}</TableCell>
              <TableCell className="text-ethiopian-charcoal">{job.company_name}</TableCell>
              <TableCell className="text-ethiopian-charcoal">{job.location}</TableCell>
              <TableCell className="text-ethiopian-charcoal">
                {new Date(job.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-ethiopian-sage text-ethiopian-sage hover:bg-ethiopian-sage hover:text-white"
                    onClick={() => handleApproval(job.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => handleApproval(job.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingJobsTable;