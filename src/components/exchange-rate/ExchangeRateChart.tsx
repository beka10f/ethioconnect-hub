import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ExchangeRateChartProps {
  data: Array<{
    date: string;
    rate: number;
  }>;
}

export const ExchangeRateChart = ({ data }: ExchangeRateChartProps) => {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-4 sm:p-6">
      <div className="h-[200px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
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
                borderRadius: '12px',
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
  );
};