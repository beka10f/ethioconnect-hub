import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsManagementTable from "./JobsManagementTable";
import { useJobsData, JobStatus } from "@/hooks/useJobsData";
import { Separator } from "@/components/ui/separator";

const JobsManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('pending');
  const { jobs, isLoading, refetch } = useJobsData(selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-semibold text-gray-900">Jobs Management</h2>
        <p className="text-sm text-gray-500">Review and manage job listings</p>
      </div>
      <Separator className="bg-gray-200" />
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex gap-1 bg-gray-100/50">
          <TabsTrigger 
            value="pending" 
            onClick={() => setSelectedStatus('pending')}
            className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => setSelectedStatus('approved')}
            className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => setSelectedStatus('rejected')}
            className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <JobsManagementTable 
            jobs={jobs} 
            onJobUpdate={refetch}
            status="pending"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          <JobsManagementTable 
            jobs={jobs} 
            onJobUpdate={refetch}
            status="approved"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-6">
          <JobsManagementTable 
            jobs={jobs} 
            onJobUpdate={refetch}
            status="rejected"
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobsManagement;