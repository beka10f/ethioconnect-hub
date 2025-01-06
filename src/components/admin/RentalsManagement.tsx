import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRentalsData, RentalStatus } from "@/hooks/useRentalsData";
import RentalsManagementTable from "./RentalsManagementTable";

const RentalsManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<RentalStatus>('pending');
  const { rentals, isLoading, refetch } = useRentalsData(selectedStatus);

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rentals Management</h2>
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
          <RentalsManagementTable 
            rentals={rentals} 
            onRentalUpdate={refetch}
            status="pending"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-0">
          <RentalsManagementTable 
            rentals={rentals} 
            onRentalUpdate={refetch}
            status="approved"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-0">
          <RentalsManagementTable 
            rentals={rentals} 
            onRentalUpdate={refetch}
            status="rejected"
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default RentalsManagement;