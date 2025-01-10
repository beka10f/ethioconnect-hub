import React from "react";
import { Card } from "@/components/ui/card";
import ShippingForm, { ShippingFormData } from "./shipping/ShippingForm";
import PricingGuide from "./shipping/PricingGuide";
import { calculateShippingCost } from "@/utils/shipping";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ShippingSummaryDialog from "./shipping/ShippingSummaryDialog";
import ShippingReceiptDialog from "./shipping/ShippingReceiptDialog";
import type { Database } from "@/integrations/supabase/types";

type ShippingStatus = Database["public"]["Enums"]["shipping_status"];

const ShippingCalculator = () => {
  const [showSummary, setShowSummary] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [currentData, setCurrentData] = React.useState<ShippingFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmationId, setConfirmationId] = React.useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (data: ShippingFormData) => {
    setCurrentData(data);
    setShowSummary(true);
  };

  const handleConfirmShipping = async () => {
    if (!currentData) return;
    
    setIsSubmitting(true);
    try {
      const shippingData = {
        customer_name: currentData.name,
        phone: currentData.phoneNumber,
        weight: parseFloat(currentData.weight),
        weight_unit: currentData.unit,
        cost: calculateShippingCost(currentData),
        shipping_date: format(currentData.shippingDate, 'yyyy-MM-dd'),
        status: 'pending' as ShippingStatus,
        created_by: null // Set to null by default for unauthenticated users
      };

      // Try to get the authenticated user, but don't require it
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        shippingData.created_by = userData.user.id;
      }

      const { data, error } = await supabase
        .from('shipping_details')
        .insert(shippingData)
        .select()
        .single();

      if (error) throw error;

      setConfirmationId(data.id);
      setShowSummary(false);
      setShowReceipt(true);
      
      toast({
        title: "Shipping request confirmed!",
        description: "Please save your receipt for reference.",
      });
    } catch (error) {
      console.error('Error saving shipping details:', error);
      toast({
        title: "Error saving shipping details",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div id="shipping-calculator" className="w-full mx-auto px-0">
        <Card className="w-full p-4 sm:p-6 bg-white shadow-lg">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ship to Ethiopia</h2>
              <div className="space-y-2 text-sm sm:text-base text-gray-600">
                <p className="leading-relaxed">Simple steps to ship your package:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Fill the form below and get your price</li>
                  <li>Click confirm and save your receipt</li>
                  <li>Bring your package and receipt to our store</li>
                  <li>Your family can pick it up in Ethiopia</li>
                </ol>
              </div>
            </div>

            <ShippingForm onSubmit={handleSubmit} />
            <PricingGuide />
          </div>
        </Card>
      </div>

      <ShippingSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        data={currentData}
        onConfirm={handleConfirmShipping}
        isSubmitting={isSubmitting}
      />

      <ShippingReceiptDialog
        open={showReceipt}
        onOpenChange={setShowReceipt}
        data={currentData}
        confirmationId={confirmationId}
      />
    </>
  );
};

export default ShippingCalculator;