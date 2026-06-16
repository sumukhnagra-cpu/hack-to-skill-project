/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Zap, 
  Leaf, 
  ShoppingBag, 
  Trash2, 
  Activity, 
  Sparkles, 
  Scale, 
  FolderHeart,
  Globe,
  Timer,
  CheckCircle2,
  TreePine,
  RotateCcw
} from 'lucide-react';

import { TravelInput, EnergyInput, FoodInput, GoodInput, WasteInput, FootprintResult, SavedCalculation, Scenario } from './types';
import { calculateFootprint } from './utils/calculators';
import MetricCard from './components/MetricCard';
import CalculatorForm from './components/CalculatorForm';
import Dashboard from './components/Dashboard';
import AiRecommendations from './components/AiRecommendations';
import HistoryLog from './components/HistoryLog';
import AuditSimulator from './components/AuditSimulator';

// Default initial inputs for first load
const INITIAL_TRAVEL: TravelInput = {
  carDistance: 10000,
  carType: 'gas_medium',
  publicDistance: 800,
  flightsShort: 1,
  flightsMedium: 0,
  flightsLong: 0
};

const INITIAL_ENERGY: EnergyInput = {
  electricityKwh: 6000,
  greenPowerPct: 15,
  gasTherm: 250,
  heatingOilGal: 0,
  coalKg: 0,
  woodKg: 0
};

const INITIAL_FOOD: FoodInput = {
  dietType: 'average_meat',
  localFoodPct: 25,
  foodWastePct: 15
};

const INITIAL_GOODS: GoodInput = {
  clothingMonthly: 80,
  electronicsYearly: 800,
  furnitureYearly: 400
};

const INITIAL_WASTE: WasteInput = {
  householdSize: 2,
  recyclePlastic: true,
  recyclePaper: true,
  recycleMetal: true,
  recycleGlass: true,
  compostOrganic: false
};

export default function App() {
  // Main states
  const [travel, setTravel] = useState<TravelInput>(INITIAL_TRAVEL);
  const [energy, setEnergy] = useState<EnergyInput>(INITIAL_ENERGY);
  const [food, setFood] = useState<FoodInput>(INITIAL_FOOD);
  const [goods, setGoods] = useState<GoodInput>(INITIAL_GOODS);
  const [waste, setWaste] = useState<WasteInput>(INITIAL_WASTE);

  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [appSection, setAppSection] = useState<'ai' | 'ledger' | 'diagnostics'>('ai');

  // Load state backups and history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('co2_calc_history_ledger');
      if (storedHistory) {
         setHistory(JSON.parse(storedHistory));
      }
      
      const savedInputs = localStorage.getItem('co2_calc_current_inputs');
      if (savedInputs) {
        const parsed = JSON.parse(savedInputs);
        if (parsed.travel) setTravel(parsed.travel);
        if (parsed.energy) setEnergy(parsed.energy);
        if (parsed.food) setFood(parsed.food);
        if (parsed.goods) setGoods(parsed.goods);
        if (parsed.waste) setWaste(parsed.waste);
      }
    } catch (e) {
      console.error('Failed to load storage payload:', e);
    }
  }, []);

  // Update localStorage as inputs change for seamless persistence
  useEffect(() => {
    try {
      const payload = { travel, energy, food, goods, waste };
      localStorage.setItem('co2_calc_current_inputs', JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }
  }, [travel, energy, food, goods, waste]);

  // Master calculated values (Memoized to prevent unnecessary recalculations on unrelated renders)
  const results: FootprintResult = useMemo(() => {
    return calculateFootprint(travel, energy, food, goods, waste);
  }, [travel, energy, food, goods, waste]);

  // Tree Offset Factor: Average tree absorbs approx 22kg (0.022 tons) of CO2 per year
  const offsetTreesNeeded = useMemo(() => {
    return Math.ceil(results.total / 0.022);
  }, [results.total]);

  // Change input handler
  const handleInputChange = (category: string, field: string, value: any) => {
    switch (category) {
      case 'travel':
        setTravel(prev => ({ ...prev, [field]: value }));
        break;
      case 'energy':
        setEnergy(prev => ({ ...prev, [field]: value }));
        break;
      case 'food':
        setFood(prev => ({ ...prev, [field]: value }));
        break;
      case 'goods':
        setGoods(prev => ({ ...prev, [field]: value }));
        break;
      case 'waste':
        setWaste(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  // Reset inputs back to defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore the default calculation values?')) {
      setTravel(INITIAL_TRAVEL);
      setEnergy(INITIAL_ENERGY);
      setFood(INITIAL_FOOD);
      setGoods(INITIAL_GOODS);
      setWaste(INITIAL_WASTE);
    }
  };

  // Profile presets loader from Audit Simulator
  const handleLoadScenario = (scenario: Scenario) => {
    setTravel(scenario.travel);
    setEnergy(scenario.energy);
    setFood(scenario.food);
    setGoods(scenario.goods);
    setWaste(scenario.waste);
    
    // Smoothly scroll down to calculator viewport
    const calcSection = document.getElementById('calculator-section-header');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load a historical log snapshot saved in the comparison ledger
  const handleLoadSavedSnapshot = (saved: SavedCalculation) => {
    setTravel(saved.inputs.travel);
    setEnergy(saved.inputs.energy);
    setFood(saved.inputs.food);
    setGoods(saved.inputs.goods);
    setWaste(saved.inputs.waste);
  };

  // Add current calculator values as a record to history list
  const handleSaveToLedger = (label: string) => {
    const newRecord: SavedCalculation = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      label,
      inputs: { travel, energy, food, goods, waste },
      results
    };
    
    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem('co2_calc_history_ledger', JSON.stringify(updated));
  };

  // Remove single comparison snapshot item
  const handleClearHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('co2_calc_history_ledger', JSON.stringify(updated));
  };

  const currentLocalTime = '2026-06-16';

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Upper Navigation/Banner */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Carbon Footprint Calculator
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                Climate Action Standard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 hidden sm:flex">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Standard: EPA/DEFRA Coefficients</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{currentLocalTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Dynamic Summary Cards dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            id="metric-card-total-emissions"
            title="Total Annual Emissions"
            value={results.total}
            unit="Tons CO2e / Year"
            icon={Globe}
            colorClass="bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
            description="Your calculated carbon weight released annually. Target: ≤ 2.0 metric tons to limit severe global warming impact."
          />
          <MetricCard
            id="metric-card-travel"
            title="Travel & Transit"
            value={results.travel}
            unit="Tons CO2e"
            icon={Car}
            colorClass="bg-emerald-50 text-emerald-750"
            description="Covers individual driving, public bus/train transits, and aviation short/medium/long distance trips."
          />
          <MetricCard
            id="metric-card-energy"
            title="House & Energy"
            value={results.energy}
            unit="Tons CO2e"
            icon={Zap}
            colorClass="bg-blue-50 text-blue-750"
            description="Computed based on electric current consumption grid mix, natural gas, heating oils, and secondary heaters."
          />
          <MetricCard
            id="metric-card-offset"
            title="Forestry Offset Equivalent"
            value={offsetTreesNeeded}
            unit="Mature Trees"
            icon={TreePine}
            colorClass="bg-teal-50 text-teal-750 font-semibold"
            description="Estimated number of full-grown trees required to fully sequester your annual carbon release over 12 months."
          />
        </section>

        {/* Major Working Stage */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left working area: Input Form */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between" id="calculator-section-header">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Footprint Parameters
              </h2>
              <button
                id="btn-restore-defaults"
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                title="Restore form back to moderate baselines"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset parameters</span>
              </button>
            </div>

            <CalculatorForm
              id="calculator-interactive-inputs"
              travel={travel}
              energy={energy}
              food={food}
              goods={goods}
              waste={waste}
              onChange={handleInputChange}
              onCalculate={() => {
                // Focus dashboard header dynamically
                const dashHeader = document.getElementById('dashboard-section-header');
                if (dashHeader) {
                  dashHeader.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>

          {/* Right working area: Dynamic Visualizations */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2" id="dashboard-section-header">
              <Activity className="w-5 h-5 text-emerald-600" />
              Comparative Dashboard
            </h2>

            <Dashboard
              id="calculator-dynamic-charts"
              results={results}
            />
          </div>
        </section>

        {/* Secondary Navigation Section (AI pathways, History Ledger, Diagnostics) */}
        <section className="space-y-6 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap border-b border-slate-200 gap-2 pb-px" role="tablist">
            <button
              id="section-tab-ai"
              role="tab"
              aria-selected={appSection === 'ai'}
              onClick={() => setAppSection('ai')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-t-xl ${
                appSection === 'ai'
                  ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Recommendations Plan</span>
            </button>

            <button
              id="section-tab-ledger"
              role="tab"
              aria-selected={appSection === 'ledger'}
              onClick={() => setAppSection('ledger')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-t-xl ${
                appSection === 'ledger'
                  ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <FolderHeart className="w-4 h-4 text-emerald-600" />
              <span>Comparison Ledger</span>
            </button>

            <button
              id="section-tab-diagnostics"
              role="tab"
              aria-selected={appSection === 'diagnostics'}
              onClick={() => setAppSection('diagnostics')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-t-xl ${
                appSection === 'diagnostics'
                  ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Diagnostic Auditing Core</span>
            </button>
          </div>

          <div className="py-2">
            <AnimatePresence mode="wait">
              {appSection === 'ai' && (
                <motion.div
                  key="section-ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <AiRecommendations
                    id="recommendations-ai-view"
                    results={results}
                    inputs={{ travel, energy, food, goods, waste }}
                  />
                </motion.div>
              )}

              {appSection === 'ledger' && (
                <motion.div
                  key="section-ledger"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <HistoryLog
                    id="ledger-history-view"
                    history={history}
                    onLoadSaved={handleLoadSavedSnapshot}
                    onClearItem={handleClearHistoryItem}
                    onSaveCurrent={handleSaveToLedger}
                    currentTotal={results.total}
                  />
                </motion.div>
              )}

              {appSection === 'diagnostics' && (
                <motion.div
                  key="section-diagnostics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <AuditSimulator
                    id="diagnostics-tester-view"
                    onLoadScenario={handleLoadScenario}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>

      {/* Humble Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-slate-300">Paris Agreement Alignment Framework</span>
          </div>
          <div className="text-center md:text-right">
            <p>Calculations adhere to IPCC greenhouse gas equivalency formulas.</p>
            <p className="opacity-60 text-[10px] mt-1">Empowering individuals with high-fidelity, actionable data for global carbon offset indexing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
