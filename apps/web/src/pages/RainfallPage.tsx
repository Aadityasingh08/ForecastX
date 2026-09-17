import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, ArrowUpRight, BarChart2, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RainfallData } from '@/types';

export const RainfallPage: React.FC = () => {
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([
    {
      location_name: 'Bhubaneswar AWS',
      district: 'Khordha',
      state: 'Odisha',
      current_intensity_mm_per_hr: 24.0,
      accumulated_24h_mm: 118.5,
      anomaly_percentage: 142.0,
      status: 'Large Excess',
      last_updated: '10:30 AM',
      source: 'IMD Real-Time AWS Network',
    },
    {
      location_name: 'Kolkata Alipore',
      district: 'Kolkata',
      state: 'West Bengal',
      current_intensity_mm_per_hr: 14.5,
      accumulated_24h_mm: 62.0,
      anomaly_percentage: 45.0,
      status: 'Excess',
      last_updated: '10:30 AM',
      source: 'IMD Real-Time AWS Network',
    },
    {
      location_name: 'Kanpur Chakeri',
      district: 'Kanpur Nagar',
      state: 'Uttar Pradesh',
      current_intensity_mm_per_hr: 1.5,
      accumulated_24h_mm: 18.0,
      anomaly_percentage: 12.0,
      status: 'Normal',
      last_updated: '10:30 AM',
      source: 'IMD Real-Time AWS Network',
    },
    {
      location_name: 'Mumbai Colaba',
      district: 'Mumbai',
      state: 'Maharashtra',
      current_intensity_mm_per_hr: 3.2,
      accumulated_24h_mm: 38.4,
      anomaly_percentage: -5.0,
      status: 'Normal',
      last_updated: '10:30 AM',
      source: 'IMD Real-Time AWS Network',
    },
  ]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">Rainfall & Nowcast Operations</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time automatic weather stations (AWS), tipping bucket rain gauges, and radar nowcast observations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Rainfall Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-extrabold text-[#0f2942] uppercase tracking-wider mb-4">
            24-Hour Accumulated Rainfall (mm) by Key AWS Station
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="location_name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="accumulated_24h_mm" fill="#2563eb" radius={[6, 6, 0, 0]} name="24h Total (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-[#0f2942] uppercase tracking-wider">
            Station Rankings & Departure Status
          </h3>
          <div className="space-y-2.5">
            {rainfallData.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.location_name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {item.district}, {item.state} • Current Rate: <strong>{item.current_intensity_mm_per_hr} mm/hr</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#0f2942]">
                    {item.accumulated_24h_mm} mm
                  </div>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                      item.status === 'Large Excess'
                        ? 'bg-red-100 text-red-700'
                        : item.status === 'Excess'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status} ({item.anomaly_percentage && item.anomaly_percentage > 0 ? `+${item.anomaly_percentage}%` : `${item.anomaly_percentage}%`})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
