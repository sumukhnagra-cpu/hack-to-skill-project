/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  Leaf, 
  CheckSquare, 
  Compass, 
  Share2,
  Lock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { FootprintResult } from '../types';

interface AiRecommendationsProps {
  id: string;
  results: FootprintResult;
  inputs: any;
}

export default function AiRecommendations({ id, results, inputs }: AiRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchAiSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results, inputs })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('Recommendations empty or invalid response shape.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Could not communicate with the server recommendations service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id={id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="text-amber-500 w-4 h-4 animate-bounce" />
            Gemini Personalized Mitigation Strategy
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Leverage server-side AI model reasoning to generate tailored, hyper-specific life pathways.
          </p>
        </div>

        <button
          id="btn-trigger-ai-rec"
          onClick={fetchAiSuggestions}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Footprint...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{recommendations ? 'Regenerate suggestions' : 'Generate AI action plan'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl text-xs border border-red-100/60 leading-relaxed flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Diagnostic Service Offline</p>
            <p className="opacity-90">{error}</p>
            <p className="mt-2 text-[10px] opacity-75">
              Make sure your Gemini API key is configured in <strong>Settings &gt; Secrets</strong> panel.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="font-medium">Gemini is looking over your travel, food, and energy factors...</p>
          <p className="text-[10px] text-slate-400 italic">Calculating standard offsets for maximum CO2 reductions</p>
        </div>
      )}

      {!loading && !recommendations && !error && (
        <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-100 rounded-xl space-y-3">
          <Leaf className="w-8 h-8 opacity-20 text-emerald-600 mx-auto" />
          <p className="font-medium max-w-md mx-auto leading-relaxed">
            Generate an AI Action Plan to analyze your calculated carbon release of <strong>{results.total.toFixed(2)} metric tons</strong>!
          </p>
          <p className="text-[10px] text-slate-400">
            You will obtain short, medium, and long-term carbon offsets computed dynamically.
          </p>
        </div>
      )}

      {recommendations && !loading && (
        <div className="space-y-4">
          <div className="prose prose-slate max-w-none text-xs text-slate-600 leading-relaxed bg-emerald-50/10 p-5 border border-emerald-50/50 rounded-2xl shadow-inner md:max-h-[500px] overflow-y-auto">
            <ReactMarkdown>{recommendations}</ReactMarkdown>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-50/50 text-emerald-950 border border-emerald-100 flex gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-xs mb-0.5">High Compliance Guarantee</h5>
                <p className="text-[10px] opacity-80 leading-relaxed">AI output lists precise localized action goals based on exact standard factors.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50/50 text-teal-950 border border-teal-100 flex gap-2">
              <Compass className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-xs mb-0.5">Continuous Improvement</h5>
                <p className="text-[10px] opacity-80 leading-relaxed">Recalculate any time to see your recommendations dynamically update.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
