import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsManagementTable from "./JobsManagementTable";
import { useJobsData, JobStatus } from "@/hooks/useJobsData";
import { Separator } from "@/components/ui/separator";

const JobsManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('pending');
  const { jobs, isLoading, refetch } = useJobsData(selectedStatus);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-ethiopian-coffee">Jobs Management</h2>
      <Separator className="bg-ethiopian-sage/20" />
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex gap-1 bg-ethiopian-cream/50">
          <TabsTrigger 
            value="pending" 
            onClick={() => setSelectedStatus('pending')}
            className="data-[state=active]:bg-ethiopian-coffee data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => setSelectedStatus('approved')}
            className="data-[state=active]:bg-ethiopian-coffee data-[state=active]:text-white"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => setSelectedStatus('rejected')}
            className="data-[state=active]:bg-ethiopian-coffee data-[state=active]:text-white"
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