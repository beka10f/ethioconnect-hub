import { useEffect, useState } from "react";
import Portal from "./Portal";
import { supabase } from "@/integrations/supabase/client";
import { MoneyTransferForm } from "./money-transfer/MoneyTransferForm";
import { ExchangeRateDisplay } from "./exchange-rate/ExchangeRateDisplay";
import { ExchangeRateChart } from "./exchange-rate/ExchangeRateChart";

const ExchangeRatePortal = () => {
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [historicalRates, setHistoricalRates] = useState<any[]>([]);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);

  useEffect(() => {
    const fetchLatestRate = async () => {
      const { data, error } = await supabase
        .from("exchange_rates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(7);

      if (error) {
        console.error("Error fetching exchange rate:", error);
        return;
      }

      if (data && data.length > 0) {
        setCurrentRate(data[0].rate);
        setLastUpdated(new Date(data[0].created_at).toLocaleDateString());
        
        const formattedData = data.reverse().map(rate => ({
          date: new Date(rate.created_at).toLocaleDateString(),
          rate: rate.rate
        }));
        setHistoricalRates(formattedData);
      }
    };

    fetchLatestRate();

    const channel = supabase
      .channel('exchange_rates_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'exchange_rates'
        },
        (payload) => {
          setCurrentRate(payload.new.rate);
          setLastUpdated(new Date(payload.new.created_at).toLocaleDateString());
          fetchLatestRate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm">
        <ExchangeRateDisplay
          currentRate={currentRate}
          lastUpdated={lastUpdated}
          onTransferClick={() => setIsTransferFormOpen(true)}
        />
        
        <div className="mt-8">
          <ExchangeRateChart data={historicalRates} />
        </div>

        {currentRate && (
          <MoneyTransferForm
            isOpen={isTransferFormOpen}
            onClose={() => setIsTransferFormOpen(false)}
            currentRate={currentRate}
          />
        )}
      </div>
    </div>
  );
};

export default ExchangeRatePortal;