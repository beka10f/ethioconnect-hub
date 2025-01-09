import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRentalsData, RentalStatus } from "@/hooks/useRentalsData";
import RentalsManagementTable from "./RentalsManagementTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Clock, CheckCircle, XCircle } from "lucide-react";

const RentalsManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<RentalStatus>('pending');
  const { rentals, isLoading, refetch } = useRentalsData(selectedStatus);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Rentals Management
        </CardTitle>
        <p className="text-sm text-gray-500">Review and manage rental listings</p>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex gap-1 bg-white border">
            <TabsTrigger 
              value="pending" 
              onClick={() => setSelectedStatus('pending')}
              className="flex items-center gap-2 data-[state=active]:bg-site-blue data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="approved" 
              onClick={() => setSelectedStatus('approved')}
              className="flex items-center gap-2 data-[state=active]:bg-site-blue data-[state=active]:text-white"
            >
              <CheckCircle className="w-4 h-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger 
              value="rejected" 
              onClick={() => setSelectedStatus('rejected')}
              className="flex items-center gap-2 data-[state=active]:bg-site-blue data-[state=active]:text-white"
            >
              <XCircle className="w-4 h-4" />
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
      </CardContent>
    </Card>
  );
};

export default RentalsManagement;