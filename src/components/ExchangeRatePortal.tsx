import Portal from "./Portal";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ExchangeRatePortal = () => {
  // Sample data - in a real app, this would come from an API
  const data = [
    { date: "Feb 14", rate: 55.8 },
    { date: "Feb 15", rate: 55.9 },
    { date: "Feb 16", rate: 56.1 },
    { date: "Feb 17", rate: 56.2 },
    { date: "Feb 18", rate: 56.3 },
    { date: "Feb 19", rate: 56.4 },
    { date: "Feb 20", rate: 56.5 },
  ];

  return (
    <Portal title="Exchange Rate">
      <div className="space-y-4">
        <div className="text-2xl font-medium text-gray-900 tracking-tight">
          1 USD = 56.50 ETB
        </div>
        <p className="text-sm text-gray-600">Last updated: Feb 20, 2024</p>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
        <button className="w-full mt-4 bg-blue-600/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200">
          View Historical Rates
        </button>
      </div>
    </Portal>
  );
};

export default ExchangeRatePortal;