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
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-center">
        <div className="text-4xl sm:text-5xl font-bold tracking-tight">
          1 USD = {currentRate?.toFixed(2) || "..."} ETB
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {lastUpdated || "Loading..."}
        </p>
      </div>
      <Button 
        onClick={onTransferClick}
        className="w-full sm:w-auto bg-site-blue hover:bg-blue-600 text-white font-semibold px-8"
        size={isMobile ? "lg" : "default"}
      >
        Send Money
      </Button>
    </div>
  );
};