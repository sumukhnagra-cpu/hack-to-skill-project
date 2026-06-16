/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CarType = 'gas_large' | 'gas_medium' | 'gas_small' | 'diesel' | 'hybrid' | 'ev';
export type DietType = 'vegan' | 'vegetarian' | 'low_meat' | 'average_meat' | 'high_meat';

export interface TravelInput {
  carDistance: number; // in miles/year
  carType: CarType;
  publicDistance: number; // in miles/year (bus/train transit)
  flightsShort: number; // flights < 3 hours counts
  flightsMedium: number; // flights 3-6 hours counts
  flightsLong: number; // flights > 6 hours counts
}

export interface EnergyInput {
  electricityKwh: number; // annual kWh
  greenPowerPct: number; // percent of green/renewable energy (0 - 100)
  gasTherm: number; // annual Gas usage (Therms)
  heatingOilGal: number; // annual heating oil (Gallons)
  coalKg: number; // annual coal (kg)
  woodKg: number; // annual wood (kg)
}

export interface FoodInput {
  dietType: DietType;
  localFoodPct: number; // percent of local organic food (0 - 100)
  foodWastePct: number; // percent of leftover wasted (0 - 100)
}

export interface GoodInput {
  clothingMonthly: number; // USD spent monthly on clothes
  electronicsYearly: number; // USD spent yearly on gadgets/electronics
  furnitureYearly: number; // USD spent yearly on furniture/appliances
}

export interface WasteInput {
  householdSize: number; // to share waste allocations
  recyclePlastic: boolean;
  recyclePaper: boolean;
  recycleMetal: boolean;
  recycleGlass: boolean;
  compostOrganic: boolean;
}

export interface FootprintResult {
  travel: number; // metric tons of CO2e per year
  energy: number; // metric tons of CO2e per year
  food: number; // metric tons of CO2e per year
  goods: number; // metric tons of CO2e per year
  waste: number; // metric tons of CO2e per year
  total: number; // overall metric tons of CO2e per year
}

export interface SavedCalculation {
  id: string;
  date: string;
  label: string;
  inputs: {
    travel: TravelInput;
    energy: EnergyInput;
    food: FoodInput;
    goods: GoodInput;
    waste: WasteInput;
  };
  results: FootprintResult;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  travel: TravelInput;
  energy: EnergyInput;
  food: FoodInput;
  goods: GoodInput;
  waste: WasteInput;
  expectedTotal: number; // expected CO2e in tons
}
