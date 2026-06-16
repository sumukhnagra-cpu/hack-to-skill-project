/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Plane, 
  Flame, 
  Zap, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Activity,
  CheckCircle2,
  TreePine
} from 'lucide-react';
import { TravelInput, EnergyInput, FoodInput, GoodInput, WasteInput, CarType, DietType } from '../types';

interface CalculatorFormProps {
  id: string;
  travel: TravelInput;
  energy: EnergyInput;
  food: FoodInput;
  goods: GoodInput;
  waste: WasteInput;
  onChange: (category: string, field: string, value: any) => void;
  onCalculate: () => void;
}

type TabType = 'travel' | 'energy' | 'food' | 'goods' | 'waste';

export default function CalculatorForm({
  id,
  travel,
  energy,
  food,
  goods,
  waste,
  onChange,
  onCalculate
}: CalculatorFormProps) {
  const [activeTab, setActiveTab ] = useState<TabType>('travel');

  const tabs: { id: TabType; label: string; icon: React.FC<any> }[] = [
    { id: 'travel', label: 'Travel', icon: Car },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'food', label: 'Food', icon: TreePine },
    { id: 'goods', label: 'Goods', icon: ShoppingBag },
    { id: 'waste', label: 'Waste', icon: Trash2 },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    } else {
      onCalculate();
    }
  };

  const handlePrev = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  return (
    <div id={id} className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 overflow-x-auto pb-px gap-2" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-t-lg ${
                isActive
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'travel' && (
            <motion.div
              key="travel"
              id="tab-panel-travel"
              role="tabpanel"
              aria-labelledby="tab-button-travel"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">
                Transportation & Flight Footprint
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="input-car-type" className="block text-sm font-medium text-slate-700">
                    Your Primary Vehicle Type
                  </label>
                  <select
                    id="input-car-type"
                    value={travel.carType}
                    onChange={(e) => onChange('travel', 'carType', e.target.value as CarType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  >
                    <option value="gas_large">SUV / Large Truck (Gasoline)</option>
                    <option value="gas_medium">Mid-size Sedan (Gasoline)</option>
                    <option value="gas_small">Compact / Hatchback (Gasoline)</option>
                    <option value="diesel">Diesel Passenger Car</option>
                    <option value="hybrid">Hybrid Engine Vehicle</option>
                    <option value="ev">100% Electric Vehicle (EV)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="input-car-distance" className="block text-sm font-medium text-slate-700">
                    Annual Car Mileage (Miles)
                  </label>
                  <input
                    id="input-car-distance"
                    type="number"
                    min="0"
                    placeholder="e.g. 12000"
                    value={travel.carDistance || ''}
                    onChange={(e) => onChange('travel', 'carDistance', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="input-public-distance" className="block text-sm font-medium text-slate-700">
                    Annual Public Transit (Train, Bus, Subway in miles)
                  </label>
                  <input
                    id="input-public-distance"
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={travel.publicDistance || ''}
                    onChange={(e) => onChange('travel', 'publicDistance', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <Plane className="w-4 h-4 text-slate-500" />
                  Air Travel (Flights in the Last 12 Months)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="input-flights-short" className="block text-xs font-medium text-slate-600">
                      Short-Haul Flights (&lt; 3h flight, e.g. Regional)
                    </label>
                    <input
                      id="input-flights-short"
                      type="number"
                      min="0"
                      value={travel.flightsShort || ''}
                      onChange={(e) => onChange('travel', 'flightsShort', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="input-flights-medium" className="block text-xs font-medium text-slate-600">
                      Medium-Haul (3-6h flight, e.g. Transcontinental)
                    </label>
                    <input
                      id="input-flights-medium"
                      type="number"
                      min="0"
                      value={travel.flightsMedium || ''}
                      onChange={(e) => onChange('travel', 'flightsMedium', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="input-flights-long" className="block text-xs font-medium text-slate-600">
                      Long-Haul (&gt; 6h flight, e.g. Intercontinental)
                    </label>
                    <input
                      id="input-flights-long"
                      type="number"
                      min="0"
                      value={travel.flightsLong || ''}
                      onChange={(e) => onChange('travel', 'flightsLong', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'energy' && (
            <motion.div
              key="energy"
              id="tab-panel-energy"
              role="tabpanel"
              aria-labelledby="tab-button-energy"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">
                Home Utility & Heating Energy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="input-electricity" className="block text-sm font-medium text-slate-700">
                    Annual Electricity Usage (kWh)
                  </label>
                  <input
                    id="input-electricity"
                    type="number"
                    min="0"
                    placeholder="e.g. 8000"
                    value={energy.electricityKwh || ''}
                    onChange={(e) => onChange('energy', 'electricityKwh', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="input-green-pct" className="block text-sm font-medium text-slate-700">
                      Green/Renewable Energy Share
                    </label>
                    <span className="text-xs font-semibold text-emerald-600">{energy.greenPowerPct}%</span>
                  </div>
                  <input
                    id="input-green-pct"
                    type="range"
                    min="0"
                    max="100"
                    value={energy.greenPowerPct}
                    onChange={(e) => onChange('energy', 'greenPowerPct', parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <p className="text-xs text-slate-400">
                    Percent of household power sourced from solar, wind, or low-carbon providers.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="input-gas" className="block text-sm font-medium text-slate-700">
                    Annual Natural Gas Usage (Therms)
                  </label>
                  <input
                    id="input-gas"
                    type="number"
                    min="0"
                    placeholder="e.g. 400"
                    value={energy.gasTherm || ''}
                    onChange={(e) => onChange('energy', 'gasTherm', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="input-oil" className="block text-sm font-medium text-slate-700">
                    Annual Heating Oil Usage (Gallons)
                  </label>
                  <input
                    id="input-oil"
                    type="number"
                    min="0"
                    placeholder="e.g. 0"
                    value={energy.heatingOilGal || ''}
                    onChange={(e) => onChange('energy', 'heatingOilGal', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-slate-500" />
                  Secondary Heating Fuel Baselines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="input-coal" className="block text-xs font-medium text-slate-600">
                      Annual Coal heating fuel (kilograms)
                    </label>
                    <input
                      id="input-coal"
                      type="number"
                      min="0"
                      value={energy.coalKg || ''}
                      onChange={(e) => onChange('energy', 'coalKg', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="input-wood" className="block text-xs font-medium text-slate-600">
                      Annual Wood/Pellet fuel (kilograms)
                    </label>
                    <input
                      id="input-wood"
                      type="number"
                      min="0"
                      value={energy.woodKg || ''}
                      onChange={(e) => onChange('energy', 'woodKg', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'food' && (
            <motion.div
              key="food"
              id="tab-panel-food"
              role="tabpanel"
              aria-labelledby="tab-button-food"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">
                Food consumption & Food Waste
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="input-diet-type" className="block text-sm font-medium text-slate-700">
                    Your Household Diet Type
                  </label>
                  <select
                    id="input-diet-type"
                    value={food.dietType}
                    onChange={(e) => onChange('food', 'dietType', e.target.value as DietType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  >
                    <option value="high_meat">High Meat Eater (Daily Beef/Lamb/Pork)</option>
                    <option value="average_meat">Average Meat Eater (Moderate Poultry, occasional red meat)</option>
                    <option value="low_meat">Low Meat / Flexitarian (Fish, rare land-based meats)</option>
                    <option value="vegetarian">Vegetarian (Dairy & eggs, no animal meats)</option>
                    <option value="vegan">Vegan (Strictly plant-based diets)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="input-local-pct" className="block text-sm font-medium text-slate-700">
                      Local or Organic Ingredient Percentage
                    </label>
                    <span className="text-xs font-semibold text-emerald-600">{food.localFoodPct}%</span>
                  </div>
                  <input
                    id="input-local-pct"
                    type="range"
                    min="0"
                    max="100"
                    value={food.localFoodPct}
                    onChange={(e) => onChange('food', 'localFoodPct', parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <p className="text-xs text-slate-400">
                    Portion of cooking items purchased from local farm shares, markets, or organically cultivated.
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="input-waste-pct" className="block text-sm font-medium text-slate-700">
                      Food Wasted/Thrown Out
                    </label>
                    <span className="text-xs font-semibold text-red-500">{food.foodWastePct}%</span>
                  </div>
                  <input
                    id="input-waste-pct"
                    type="range"
                    min="0"
                    max="60"
                    value={food.foodWastePct}
                    onChange={(e) => onChange('food', 'foodWastePct', parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <p className="text-xs text-slate-400">
                    Estimated percentage of meals, produce, or leftovers discarded instead of consumed or recycled.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'goods' && (
            <motion.div
              key="goods"
              id="tab-panel-goods"
              role="tabpanel"
              aria-labelledby="tab-button-goods"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">
                Purchasing Habits & Goods
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="input-clothing" className="block text-sm font-medium text-slate-700">
                    Clothing Expense ($/month)
                  </label>
                  <input
                    id="input-clothing"
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
                    value={goods.clothingMonthly || ''}
                    onChange={(e) => onChange('goods', 'clothingMonthly', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="input-electronics" className="block text-sm font-medium text-slate-700">
                    Electronics Expense ($/year)
                  </label>
                  <input
                    id="input-electronics"
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={goods.electronicsYearly || ''}
                    onChange={(e) => onChange('goods', 'electronicsYearly', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="input-furniture" className="block text-sm font-medium text-slate-700">
                    Furniture & Decor ($/year)
                  </label>
                  <input
                    id="input-furniture"
                    type="number"
                    min="0"
                    placeholder="e.g. 200"
                    value={goods.furnitureYearly || ''}
                    onChange={(e) => onChange('goods', 'furnitureYearly', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'waste' && (
            <motion.div
              key="waste"
              id="tab-panel-waste"
              role="tabpanel"
              aria-labelledby="tab-button-waste"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-2">
                Household Waste & Advanced Recycling
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="input-household-size" className="block text-sm font-medium text-slate-700">
                    Household Size (Number of People)
                  </label>
                  <input
                    id="input-household-size"
                    type="number"
                    min="1"
                    value={waste.householdSize || 1}
                    onChange={(e) => onChange('waste', 'householdSize', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-slate-500" />
                  Your Active Recycling & Mitigation Commitments
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Select which carbon-mitigating recycling pipelines you actively keep up in your residence.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-recycle-plastic"
                      type="checkbox"
                      checked={waste.recyclePlastic}
                      onChange={(e) => onChange('waste', 'recyclePlastic', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded-sm focus:ring-emerald-500"
                    />
                    <label htmlFor="checkbox-recycle-plastic" className="ml-2 text-sm text-slate-700 cursor-pointer">
                      Recycle Plastic
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="checkbox-recycle-paper"
                      type="checkbox"
                      checked={waste.recyclePaper}
                      onChange={(e) => onChange('waste', 'recyclePaper', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded-sm focus:ring-emerald-500"
                    />
                    <label htmlFor="checkbox-recycle-paper" className="ml-2 text-sm text-slate-700 cursor-pointer">
                      Recycle Paper/Cardboard
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="checkbox-recycle-metal"
                      type="checkbox"
                      checked={waste.recycleMetal}
                      onChange={(e) => onChange('waste', 'recycleMetal', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded-sm focus:ring-emerald-500"
                    />
                    <label htmlFor="checkbox-recycle-metal" className="ml-2 text-sm text-slate-700 cursor-pointer">
                      Recycle Metal (Cans/Foil)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="checkbox-recycle-glass"
                      type="checkbox"
                      checked={waste.recycleGlass}
                      onChange={(e) => onChange('waste', 'recycleGlass', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded-sm focus:ring-emerald-500"
                    />
                    <label htmlFor="checkbox-recycle-glass" className="ml-2 text-sm text-slate-700 cursor-pointer">
                      Recycle Glass Containers
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="checkbox-compost-organic"
                      type="checkbox"
                      checked={waste.compostOrganic}
                      onChange={(e) => onChange('waste', 'compostOrganic', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded-sm focus:ring-emerald-500"
                    />
                    <label htmlFor="checkbox-compost-organic" className="ml-2 text-sm text-slate-700 cursor-pointer">
                      Active Food Composting
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
        <button
          id="btn-calculator-prev"
          type="button"
          onClick={handlePrev}
          disabled={activeTab === 'travel'}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="btn-calculator-next"
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <span>{activeTab === 'waste' ? 'Calculate Footprint' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
