import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRentalsData, RentalStatus } from "@/hooks/useRentalsData";
import RentalsManagementTable from "./RentalsManagementTable";

const RentalsManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<RentalStatus>('pending');
  const { rentals, isLoading, refetch } = useRentalsData(selectedStatus);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex gap-1 bg-gray-100/50">
          <TabsTrigger 
            value="pending" 
            onClick={() => setSelectedStatus('pending')}
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => setSelectedStatus('approved')}
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => setSelectedStatus('rejected')}
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <RentalsManagementTable 
            rentals={rentals} 
            onRentalUpdate={refetch}
            status="pending"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          <RentalsManagementTable 
            rentals={rentals} 
            onRentalUpdate={refetch}
            status="approved"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-6">
          <RentalsManagementTable 
            rentals={rentals} 
            onRentalUpdate={refetch}
            status="rejected"
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RentalsManagement;