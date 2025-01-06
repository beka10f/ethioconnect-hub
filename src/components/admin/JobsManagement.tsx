import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsManagementTable from "./JobsManagementTable";
import { useJobsData, JobStatus } from "@/hooks/useJobsData";

const JobsManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('pending');
  const { jobs, isLoading, refetch } = useJobsData(selectedStatus);

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Jobs Management</h2>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger 
            value="pending" 
            onClick={() => setSelectedStatus('pending')}
          >
            Pending Approval
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => setSelectedStatus('approved')}
          >
            Approved
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => setSelectedStatus('rejected')}
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <JobsManagementTable 
            jobs={jobs} 
            onJobUpdate={refetch}
            status="pending"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-0">
          <JobsManagementTable 
            jobs={jobs} 
            onJobUpdate={refetch}
            status="approved"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-0">
          <JobsManagementTable 
            jobs={jobs} 
            onJobUpdate={refetch}
            status="rejected"
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default JobsManagement;