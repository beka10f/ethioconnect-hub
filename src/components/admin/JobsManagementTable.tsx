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
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, Calendar } from "lucide-react";

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

  const getStatusColor = (jobStatus: string) => {
    switch (jobStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const MobileJobCard = ({ job }: { job: Job }) => (
    <Card 
      className="mb-3 last:mb-0 overflow-hidden border-0 shadow-sm"
      onClick={() => setSelectedJob(job)}
    >
      <CardContent className="p-0">
        <div className="px-4 py-3 bg-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{job.company_name}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          </div>
          
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {status === 'pending' && (
            <div className="mt-3 flex gap-2">
              <JobActions 
                jobId={job.id}
                onUpdate={onJobUpdate}
                showActions={true}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="md:hidden px-4 py-2">
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
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-semibold">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Posted by {selectedJob?.company_name} on {selectedJob?.created_at && new Date(selectedJob.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Description</h4>
              <p className="text-gray-700">{selectedJob?.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Location</h4>
              <p className="text-gray-700">{selectedJob?.location}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Contact Information</h4>
              <p className="text-gray-700">Email: {selectedJob?.contact_info}</p>
              <p className="text-gray-700">Phone: {selectedJob?.phone_number}</p>
            </div>
            {status === 'pending' && selectedJob && (
              <div className="flex justify-end gap-2 pt-4 border-t">
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