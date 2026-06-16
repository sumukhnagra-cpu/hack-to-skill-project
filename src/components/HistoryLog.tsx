/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderHeart, 
  Trash2, 
  Calendar, 
  Sparkles, 
  ArrowUpRight,
  BookmarkCheck,
  Plus
} from 'lucide-react';
import { SavedCalculation } from '../types';

interface HistoryLogProps {
  id: string;
  history: SavedCalculation[];
  onLoadSaved: (saved: SavedCalculation) => void;
  onClearItem: (id: string) => void;
  onSaveCurrent: (label: string) => void;
  currentTotal: number;
}

export default function HistoryLog({
  id,
  history,
  onLoadSaved,
  onClearItem,
  onSaveCurrent,
  currentTotal
}: HistoryLogProps) {
  const [newLabel, setNewLabel] = useState('');

  const submitSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    onSaveCurrent(newLabel.trim());
    setNewLabel('');
  };

  return (
    <div id={id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex justify-between items-center border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FolderHeart className="text-emerald-500 w-4 h-4" />
            Comparison Ledger & Saved Footprints
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Persist and log multiple simulation trials to index offsets over time.
          </p>
        </div>
      </div>

      {/* Save current benchmark input form */}
      <form onSubmit={submitSave} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 transition-all flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 space-y-1 w-full">
          <label htmlFor="input-save-label" className="text-xs font-semibold text-slate-600 block">
            Save Current Calculator State
          </label>
          <input
            id="input-save-label"
            type="text"
            required
            placeholder="e.g. My baseline 2026, After hybrid vehicle upgrade..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
        <button
          id="btn-save-footprint"
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Current (~{currentTotal.toFixed(1)}t)</span>
        </button>
      </form>

      {/* List Ledger ledger item container */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-100 rounded-xl"
            >
              <BookmarkCheck className="w-8 h-8 opacity-25 mx-auto mb-2 text-slate-400" />
              <p>No logged computations stored locally. Save a calculation to populate the history.</p>
            </motion.div>
          ) : (
            history.map((record) => (
              <motion.div
                key={record.id}
                id={`record-${record.id}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-white border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between gap-4 transition-all hover:shadow-xs group"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate" id={`record-title-${record.id}`}>
                      {record.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${
                      record.results.total <= 2.2 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : record.results.total <= 5.0 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {record.results.total.toFixed(2)} tCO2e/yr
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 items-center">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                    <span className="text-slate-200">•</span>
                    <span>🚗 {record.results.travel.toFixed(1)}t</span>
                    <span>•</span>
                    <span>⚡ {record.results.energy.toFixed(1)}t</span>
                    <span>•</span>
                    <span>🥗 {record.results.food.toFixed(1)}t</span>
                    <span>•</span>
                    <span>🛍️ {record.results.goods.toFixed(1)}t</span>
                    <span>•</span>
                    <span>♻️ {record.results.waste.toFixed(1)}t</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id={`btn-load-record-${record.id}`}
                    type="button"
                    onClick={() => onLoadSaved(record)}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold border border-slate-100 group-hover:border-emerald-100"
                    title="Load these metrics into calculator"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`btn-delete-record-${record.id}`}
                    type="button"
                    onClick={() => onClearItem(record.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                    title="Delete historical bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
