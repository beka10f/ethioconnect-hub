import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRentalsData, RentalStatus } from "@/hooks/useRentalsData";
import RentalsManagementTable from "./RentalsManagementTable";
import RentalApplicationsTable from "./RentalApplicationsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RentalsManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<RentalStatus>('pending');
  const { rentals, isLoading, refetch } = useRentalsData(selectedStatus);

  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['rental-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_applications')
        .select(`
          *,
          rental:rentals (
            title,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Rentals Management
        </CardTitle>
        <p className="text-sm text-gray-500">Review and manage rental listings and applications</p>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1 bg-white border rounded-lg p-1">
            <TabsTrigger 
              value="pending" 
              onClick={() => setSelectedStatus('pending')}
              className="flex items-center gap-2 data-[state=active]:bg-site-blue data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4" />
              <span className="whitespace-nowrap">Pending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="approved" 
              onClick={() => setSelectedStatus('approved')}
              className="flex items-center gap-2 data-[state=active]:bg-site-blue data-[state=active]:text-white"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="whitespace-nowrap">Approved</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rejected" 
              onClick={() => setSelectedStatus('rejected')}
              className="flex items-center gap-2 data-[state=active]:bg-site-blue data-[state=active]:text-white"
            >
              <XCircle className="w-4 h-4" />
              <span className="whitespace-nowrap">Rejected</span>
            </TabsTrigger>
            <TabsTrigger 
              value="applications"
              className="flex items-center gap-2 data-[state=active]:bg-site-blue data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              <span className="whitespace-nowrap">Applications</span>
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
          <TabsContent value="applications" className="mt-6">
            <RentalApplicationsTable 
              applications={applications || []}
              isLoading={isLoadingApplications}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RentalsManagement;