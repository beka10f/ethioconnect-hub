import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Job } from "@/hooks/useJobsData";
import JobActions from "./JobActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface JobsManagementTableProps {
  jobs: Job[];
  onJobUpdate: () => void;
  status: 'pending' | 'approved' | 'rejected';
  isLoading: boolean;
}

const JobsManagementTable = ({ jobs, onJobUpdate, status, isLoading }: JobsManagementTableProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50 p-4">
        <p className="text-center text-gray-500">Loading jobs...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50 p-8">
        <p className="text-center text-gray-500">No jobs found</p>
      </div>
    );
  }

  const MobileJobCard = ({ job }: { job: Job }) => (
    <Card className="mb-4 last:mb-0">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company_name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{job.location}</p>
          <p className="text-sm text-gray-600">
            {new Date(job.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
            onClick={() => setSelectedJob(job)}
          >
            View
          </Button>
          <JobActions 
            jobId={job.id}
            onUpdate={onJobUpdate}
            showActions={status === 'pending'}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="md:hidden p-4">
            {jobs.map((job) => (
              <MobileJobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-gray-900 font-medium">Title</TableHead>
                  <TableHead className="text-gray-900 font-medium">Company</TableHead>
                  <TableHead className="text-gray-900 font-medium">Location</TableHead>
                  <TableHead className="text-gray-900 font-medium">Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">Actions</TableHead>
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
                          type="button"
                          variant="outline"
                          className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
                          onClick={() => setSelectedJob(job)}
                        >
                          View
                        </Button>
                        <JobActions 
                          jobId={job.id}
                          onUpdate={onJobUpdate}
                          showActions={status === 'pending'}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-sm">
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
            {status === 'pending' && selectedJob && (
              <div className="flex justify-end gap-2 pt-4">
                <JobActions 
                  jobId={selectedJob.id}
                  onUpdate={() => {
                    onJobUpdate();
                    setSelectedJob(null);
                  }}
                  showActions={true}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobsManagementTable;