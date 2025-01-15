import React from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExchangeRateDisplayProps {
  currentRate: number | null;
  lastUpdated: string | null;
  onTransferClick: () => void;
}

export const ExchangeRateDisplay = ({
  currentRate,
  lastUpdated,
  onTransferClick,
}: ExchangeRateDisplayProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
      <div className="w-full sm:w-auto text-center sm:text-left">
        <div className="text-4xl font-bold text-gray-900">
          1 USD = {currentRate?.toFixed(2) || "..."} ETB
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {lastUpdated || "Loading..."}
        </p>
      </div>
      <Button 
        onClick={onTransferClick}
        className="w-full sm:w-auto bg-site-blue hover:bg-blue-700 text-white font-semibold"
        size={isMobile ? "lg" : "default"}
      >
        Send Money
      </Button>
    </div>
  );
};