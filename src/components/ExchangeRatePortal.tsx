import { useEffect, useState } from "react";
import Portal from "./Portal";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ExchangeRatePortal = () => {
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [historicalRates, setHistoricalRates] = useState<any[]>([]);

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
        
        // Format historical data for the chart
        const formattedData = data.reverse().map(rate => ({
          date: new Date(rate.created_at).toLocaleDateString(),
          rate: rate.rate
        }));
        setHistoricalRates(formattedData);
      }
    };

    fetchLatestRate();

    // Subscribe to changes
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
          fetchLatestRate(); // Refresh historical data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Portal title="Exchange Rate">
      <div className="space-y-4">
        <div className="text-2xl font-medium text-gray-900 tracking-tight">
          1 USD = {currentRate?.toFixed(2) || "..."} ETB
        </div>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdated || "Loading..."}
        </p>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalRates}>
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Portal>
  );
};

export default ExchangeRatePortal;