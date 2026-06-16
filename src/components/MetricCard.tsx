/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  colorClass: string; // Tailwind bg/text utility classes
  description: string;
}

export default function MetricCard({
  id,
  title,
  value,
  unit,
  icon: Icon,
  colorClass,
  description
}: MetricCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-sans text-slate-900 tracking-tight">
              {value.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-500">
              {unit}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-4 leading-relaxed border-t border-slate-50/80 pt-3">
        {description}
      </p>
    </motion.div>
  );
}
