import { useEffect, useState } from "react";
import Portal from "./Portal";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "./ui/button";
import { MoneyTransferForm } from "./money-transfer/MoneyTransferForm";
import { useIsMobile } from "@/hooks/use-mobile";

const ExchangeRatePortal = () => {
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [historicalRates, setHistoricalRates] = useState<any[]>([]);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const isMobile = useIsMobile();

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
    <Portal title="Exchange Rate">
      <div className="space-y-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Rate Display and Send Money Button */}
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
            onClick={() => setIsTransferFormOpen(true)}
            className="w-full sm:w-auto bg-site-blue hover:bg-blue-700 text-white font-semibold"
            size={isMobile ? "lg" : "default"}
          >
            Send Money
          </Button>
        </div>

        {/* Chart Section */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 sm:p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalRates} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280' }}
                  dy={10}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280' }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Money Transfer Form Dialog */}
        {currentRate && (
          <MoneyTransferForm
            isOpen={isTransferFormOpen}
            onClose={() => setIsTransferFormOpen(false)}
            currentRate={currentRate}
          />
        )}
      </div>
    </Portal>
  );
};

export default ExchangeRatePortal;