import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, Phone, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ShippingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: shipping, isLoading, error } = useQuery({
    queryKey: ["shipping", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_details")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Shipping details not found");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading shipping details",
      description: "Please try again later",
      variant: "destructive",
    });
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <div className="text-center text-red-500">
          Unable to load shipping details
        </div>
      </div>
    );
  }

  if (!shipping) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <div className="text-center text-gray-500">
          Shipping details not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto p-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="text-center border-b border-gray-100 pb-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="rounded-xl bg-blue-50 p-3">
                <Package className="w-6 h-6 text-site-blue" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Shipping Details
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Confirmation ID: {shipping.id.slice(0, 8)}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Sender</h3>
                <p className="text-sm text-gray-600">{shipping.customer_name}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Phone className="w-3 h-3" />
                  <p>{shipping.phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Receiver</h3>
                <p className="text-sm text-gray-600">{shipping.receiver_name}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Phone className="w-3 h-3" />
                  <p>{shipping.receiver_phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Package Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium text-gray-900">
                    {shipping.weight} {shipping.weight_unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drop-off Date</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(shipping.shipping_date), "MMM do, yyyy")}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Cost</p>
                <p className="text-lg font-bold text-site-blue">
                  ${shipping.cost}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Status</h3>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  shipping.status === 'completed' 
                    ? 'bg-green-500' 
                    : shipping.status === 'in_progress'
                    ? 'bg-yellow-500'
                    : shipping.status === 'cancelled'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`} />
                <p className="text-sm capitalize text-gray-600">
                  {shipping.status.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                <p>Drop-off Location:</p>
              </div>
              <p className="mt-1 text-gray-900">
                3111 Chillum Road, Mount Rainer, MD
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;