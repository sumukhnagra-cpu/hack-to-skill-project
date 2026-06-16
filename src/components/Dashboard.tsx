/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FootprintResult } from '../types';
import { getComparativeAverages } from '../utils/calculators';
import { 
  Milestone, 
  TrendingDown, 
  Compass, 
  FlameKindling,
  AlertTriangle,
  Heart
} from 'lucide-react';

interface DashboardProps {
  id: string;
  results: FootprintResult;
}

export default function Dashboard({ id, results }: DashboardProps) {
  const averages = useMemo(() => getComparativeAverages(), []);

  // Category breakdown data is perfect for a pie/donut chart
  const pieData = useMemo(() => {
    return [
      { name: 'Travel & Transport', value: results.travel, color: '#10b981' }, // emerald-500
      { name: 'Utility Energy', value: results.energy, color: '#3b82f6' }, // blue-500
      { name: 'Food & Diet', value: results.food, color: '#f59e0b' },    // amber-500
      { name: 'Purchases & Goods', value: results.goods, color: '#ec4899' },  // pink-500
      { name: 'Residual Waste', value: results.waste, color: '#8b5cf6' },    // violet-500
    ].filter(item => item.value > 0);
  }, [results]);

  // Comparative benchmarks data for comparison chart
  const comparisonData = useMemo(() => {
    return [
      { name: 'Climate Safe Target', value: averages.climateTarget, fill: '#059669', desc: 'Required by 2030 to limit warming' },
      { name: 'You', value: results.total, fill: results.total <= averages.climateTarget ? '#10b981' : results.total <= averages.global ? '#0284c7' : '#ef4444', desc: 'Your calculated carbon footprint' },
      { name: 'Global Average', value: averages.global, fill: '#f59e0b', desc: 'Global per capita average footprint' },
      { name: 'European Average', value: averages.europe, fill: '#8b5cf6', desc: 'EU typical lifestyle emission index' },
      { name: 'US Average', value: averages.us, fill: '#e11d48', desc: 'Typical USA high-consumption baseline' },
    ];
  }, [results, averages]);

  // Dynamic feedback copy based on the score
  const getScoreVerdict = () => {
    const total = results.total;
    if (total <= 2.0) {
      return {
        title: 'Outstanding Carbon Steward!',
        desc: 'Fantastic! Your carbon output conforms with the 1.5C global warming target limits. You are setting a phenomenal eco-pioneer standard.',
        icon: Heart,
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
        iconBg: 'bg-emerald-500 text-white'
      };
    } else if (total <= 4.5) {
      return {
        title: 'Moderate Green Resident',
        desc: 'Excellent. You are within the planetary average bounds, but there is still space to trim auxiliary travel and electricity waste down further.',
        icon: Compass,
        bg: 'bg-blue-50 text-blue-800 border-blue-100',
        iconBg: 'bg-blue-500 text-white'
      };
    } else if (total <= 12.0) {
      return {
        title: 'Noticeable Carbon Footprint',
        desc: 'Your emissions index sits significantly higher than climate targets. Small changes like decreasing grid utility waste and meat consumption can have a major reduction impact.',
        icon: TrendingDown,
        bg: 'bg-amber-50 text-amber-800 border-amber-100',
        iconBg: 'bg-amber-500 text-white'
      };
    } else {
      return {
        title: 'High Climate Intensity',
        desc: 'Your calculations show highly elevated atmospheric release. Implementing EV transitions, solar home greening, or efficient temperature controls is highly recommended.',
        icon: AlertTriangle,
        bg: 'bg-red-50 text-red-800 border-red-100',
        iconBg: 'bg-red-500 text-white'
      };
    }
  };

  const verdict = getScoreVerdict();
  const VerdictIcon = verdict.icon;

  return (
    <div id={id} className="space-y-6">
      {/* Dynamic carbon footprint warning and reward card */}
      <div className={`mt-2 p-5 rounded-2xl border flex flex-col sm:flex-row items-start gap-4 transition-all ${verdict.bg}`}>
        <div className={`p-3 rounded-xl flex-shrink-0 ${verdict.iconBg}`}>
          <VerdictIcon className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-semibold text-base mb-1">{verdict.title}</h4>
          <p className="text-sm leading-relaxed opacity-90">{verdict.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category breakdown (donut chart) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Emission Categories breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Visualizing which lifestyle compartments contribute to your footprint.
            </p>
          </div>

          <div className="h-[240px] flex items-center justify-center relative">
            {pieData.length === 0 ? (
              <span className="text-sm text-slate-400">No emissions logged yet</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} Metric Tons CO2e`, 'Carbon Output']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontFamily: 'Inter, sans`serif' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* Center label inside donut chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">{results.total.toFixed(1)}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tons Total</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
            {pieData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="truncate">{entry.name}</span>
                <span className="font-bold ml-auto">({((entry.value / results.total) * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Global Benchmark Comparison
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comparing your annual carbon release (tons of CO2e) with standard regions.
            </p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)} tCO2e / year`, 'Annual Carbon']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={40}
                >
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-400 mt-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50 flex gap-2 items-center">
            <Milestone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Did you know?</strong> Under the Paris Agreement, aligning to a 1.5C global limit requires a baseline transition towards less than <strong>2.0 metric tons per capital</strong> by the year 2030.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
