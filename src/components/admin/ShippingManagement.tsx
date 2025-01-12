import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ShippingManagementTable from "./ShippingManagementTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ShippingManagement = () => {
  const { data: shippingRequests, isLoading } = useQuery({
    queryKey: ["shipping-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_details")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching shipping requests:", error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Shipping Requests
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track all shipping requests
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg">All Requests</CardTitle>
        </CardHeader>
        <CardContent className="-mx-4 sm:mx-0">
          <ShippingManagementTable
            shippingRequests={shippingRequests || []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingManagement;