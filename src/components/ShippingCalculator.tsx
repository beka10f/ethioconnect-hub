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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InfoIcon, Package, ChevronDown } from "lucide-react";

type ShippingStatus = Database["public"]["Enums"]["shipping_status"];

const ShippingCalculator = () => {
  const [showSummary, setShowSummary] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [currentData, setCurrentData] = React.useState<ShippingFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
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
        created_by: null,
        receiver_name: currentData.receiverName,
        receiver_phone: currentData.receiverPhone
      };

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
      <div id="shipping-calculator" className="w-full mx-auto">
        <Card className="w-full bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="space-y-6">
            <div className="text-center border-b border-gray-100 px-4 py-6 sm:px-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="rounded-xl bg-blue-50 p-3">
                  <Package className="w-6 h-6 text-site-blue" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ship to Ethiopia</h2>
              </div>
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger className="flex items-center justify-center gap-2 text-sm sm:text-base text-primary hover:text-primary/80 mx-auto group">
                  <InfoIcon className="h-4 w-4" />
                  <span>How it works</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 mx-auto max-w-md">
                  <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                      <li>Enter package details for price</li>
                      <li>Get receipt</li>
                      <li>Drop off package</li>
                      <li>Pickup in Ethiopia</li>
                    </ol>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="px-4 sm:px-6 pb-6">
              <ShippingForm onSubmit={handleSubmit} />
              <PricingGuide />
            </div>
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