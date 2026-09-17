import React, { useState, useEffect } from 'react';
import { TrendingUp, GitCompare, CheckCircle, BarChart3, AlertCircle, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchClimateTrends, fetchModelComparison, fetchVerificationMetrics } from '@/services/api';
import { ModelComparisonResponse, VerificationMetric } from '@/types';

export const ClimatePage: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);
  const [modelComp, setModelComp] = useState<ModelComparisonResponse | null>(null);
  const [verifications, setVerifications] = useState<VerificationMetric[]>([]);

  useEffect(() => {
    fetchClimateTrends().then((data) => setTrends(data));
    fetchModelComparison('Delhi').then((data) => setModelComp(data));
    fetchVerificationMetrics().then((data) => setVerifications(data));
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">
              Climate Analysis & Model Verification
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative 30-year climatological normals, multi-model NWP divergence analysis, and MAE/RMSE verification.
          </p>
        </div>
      </div>

      {/* 1. Multi-Model Comparison (IMD vs ECMWF vs GFS) */}
      {modelComp && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-extrabold text-[#0f2942]">
                Multi-Model NWP Comparison: {modelComp.location} (Date: {modelComp.forecast_date})
              </h3>
            </div>
            {modelComp.disagreement_detected && (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                Model Disagreement Detected
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modelComp.models.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{m.confidence_level} Conf.</span>
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Forecast Temp:</span>
                    <strong className="text-slate-900">{m.temperature_c}°C</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Rainfall:</span>
                    <strong className="text-blue-700">{m.rainfall_mm} mm</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Wind:</span>
                    <span>{m.wind_speed_kmph} km/h</span>
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 border-t border-slate-200 pt-1.5 font-mono">
                  Run: {m.run_timestamp}
                </p>
              </div>
            ))}
          </div>

          {modelComp.disagreement_details && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
              <strong>Meteorological Variance Analysis:</strong> {modelComp.disagreement_details}
            </div>
          )}
        </div>
      )}

      {/* 2. Climate Trends & Anomalies Chart */}
      {trends && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-[#0f2942]">
                Monthly Temperature Anomalies vs 30-Year Normal ({trends.baseline_period})
              </h3>
              <p className="text-xs text-slate-500">{trends.trend_summary}</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{trends.dataset}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends.series}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="normal" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Normal (°C)" />
                <Bar dataKey="observed_mean" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Observed Mean (°C)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Verification Scorecards Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-[#0f2942]">
          Authoritative Forecast Verification & Operational Metrics
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[10px]">
                <th className="pb-2">LOCATION</th>
                <th className="pb-2">MODEL ARCHITECTURE</th>
                <th className="pb-2">PERIOD</th>
                <th className="pb-2">MAE (°C)</th>
                <th className="pb-2">RMSE (°C)</th>
                <th className="pb-2">BIAS (°C)</th>
                <th className="pb-2 text-right">ACCURACY SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {verifications.map((v, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 font-bold text-slate-900">{v.location}</td>
                  <td className="py-2.5 font-semibold text-blue-700">{v.model_name}</td>
                  <td className="py-2.5 text-slate-500">{v.period}</td>
                  <td className="py-2.5 font-mono">{v.mae_temperature.toFixed(2)}</td>
                  <td className="py-2.5 font-mono">{v.rmse_temperature.toFixed(2)}</td>
                  <td className="py-2.5 font-mono text-slate-600">{v.bias_temperature.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-extrabold text-emerald-700">
                    {v.rainfall_accuracy_score}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
