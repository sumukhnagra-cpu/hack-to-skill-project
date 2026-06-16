/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TravelInput, EnergyInput, FoodInput, GoodInput, WasteInput, FootprintResult } from '../types';

// Emission intensity coefficients (metric tons of CO2e per unit)
export const EMISSION_FACTORS = {
  // Cars (tons of CO2e per mile)
  car: {
    gas_large: 0.00045,  // SUV, light trucks (~450g/ml)
    gas_medium: 0.00035, // Medium sedans (~350g/ml)
    gas_small: 0.00025,  // Compact cars (~250g/ml)
    diesel: 0.00032,     // Diesel vehicles (~320g/ml)
    hybrid: 0.00016,     // Hybrid passenger cars (~160g/ml)
    ev_base: 0.00008,    // EV average grid power factor (~80g/ml)
  },
  // Public transit (tons of CO2e per mile per person)
  transit: 0.00010,      // Trains/buses average (~100g/ml)

  // Flights (flat tons of CO2e per single flight)
  flight: {
    short: 0.15,         // Short haul (< 3 hours, short domestic/regional)
    medium: 0.35,        // Medium haul (3-6 hours, continental)
    long: 0.85,          // Long haul (> 6 hours, intercontinental)
  },

  // Home energy
  electricity_kwh: 0.00038, // Grid carbon intensity (US average ~380g/kWh)
  gas_therm: 0.0053,        // Natural gas (5.3kg per therm)
  oil_gal: 0.01015,         // Heating oil (10.15kg per gallon)
  coal_kg: 0.00242,         // Coal heating (2.42kg per kg coal)
  wood_kg: 0.0015,          // Wood fuel heating (1.5kg per kg wood)

  // Food annual baseline emissions by diet type (tons of CO2e per year)
  food_diet: {
    vegan: 1.1,
    vegetarian: 1.4,
    low_meat: 1.8,
    average_meat: 2.5,
    high_meat: 3.3,
  },

  // Goods/Consumption (tons of CO2e per dollar spent)
  goods: {
    clothing: 0.00018,    // Clothes/shoes (~180g per $)
    electronics: 0.00035, // Computers, phones, appliances (~350g per $)
    furniture: 0.00028,   // Furniture & homeware (~280g per $)
  },

  // Waste
  waste_baseline_per_person: 0.75, // Standard municipal waste per person per year
  recycling_savings: {
    plastic: 0.06,
    paper: 0.08,
    metal: 0.05,
    glass: 0.04,
    compost: 0.07,
  }
};

/**
 * Calculates the annual carbon footprint split into categories.
 * All units are converted to metric tons of CO2e per year.
 */
export function calculateFootprint(
  travel: TravelInput,
  energy: EnergyInput,
  food: FoodInput,
  goods: GoodInput,
  waste: WasteInput
): FootprintResult {
  
  // 1. Travel Emissions
  let carEmission = 0;
  if (travel.carType === 'ev') {
    // EVs run on electric grid, discount based on renewable energy percentage
    carEmission = travel.carDistance * EMISSION_FACTORS.car.ev_base * (1 - energy.greenPowerPct / 100);
  } else {
    carEmission = travel.carDistance * EMISSION_FACTORS.car[travel.carType];
  }

  const publicTransitEmission = travel.publicDistance * EMISSION_FACTORS.transit;
  const flightEmission = 
    (travel.flightsShort * EMISSION_FACTORS.flight.short) +
    (travel.flightsMedium * EMISSION_FACTORS.flight.medium) +
    (travel.flightsLong * EMISSION_FACTORS.flight.long);

  const travelTotal = Number((carEmission + publicTransitEmission + flightEmission).toFixed(2));

  // 2. Home Energy Emissions
  const electricityEmission = travel.carType === 'ev' 
    ? (energy.electricityKwh * EMISSION_FACTORS.electricity_kwh * (1 - energy.greenPowerPct / 100))
    : (energy.electricityKwh * EMISSION_FACTORS.electricity_kwh * (1 - energy.greenPowerPct / 100)); // Standard electric footprint

  const gasEmission = energy.gasTherm * EMISSION_FACTORS.gas_therm;
  const oilEmission = energy.heatingOilGal * EMISSION_FACTORS.oil_gal;
  const coalEmission = energy.coalKg * EMISSION_FACTORS.coal_kg;
  const woodEmission = energy.woodKg * EMISSION_FACTORS.wood_kg;

  const energyTotal = Number((electricityEmission + gasEmission + oilEmission + coalEmission + woodEmission).toFixed(2));

  // 3. Food/Diet Emissions
  const baseFoodEmissions = EMISSION_FACTORS.food_diet[food.dietType];
  // Local food offsets up to 15% of food emissions
  const localDeduction = (food.localFoodPct / 100) * 0.15;
  // Food waste adds overhead: baseline is 15% waste. Every 5% shift alters score by 2.5%
  const wasteMultiplier = 1 + ((food.foodWastePct - 15) * 0.005);
  
  const foodTotal = Number((baseFoodEmissions * (1 - localDeduction) * Math.max(0.7, wasteMultiplier)).toFixed(2));

  // 4. Consumer Goods Emissions
  const clothingTons = (goods.clothingMonthly * 12) * EMISSION_FACTORS.goods.clothing;
  const electronicsTons = goods.electronicsYearly * EMISSION_FACTORS.goods.electronics;
  const furnitureTons = goods.furnitureYearly * EMISSION_FACTORS.goods.furniture;

  const goodsTotal = Number((clothingTons + electronicsTons + furnitureTons).toFixed(2));

  // 5. Waste Emissions per cap. (Shared household recycling reduction, but scaled individually)
  let individualWasteOutput = EMISSION_FACTORS.waste_baseline_per_person;
  
  if (waste.recyclePlastic) individualWasteOutput -= EMISSION_FACTORS.recycling_savings.plastic;
  if (waste.recyclePaper) individualWasteOutput -= EMISSION_FACTORS.recycling_savings.paper;
  if (waste.recycleMetal) individualWasteOutput -= EMISSION_FACTORS.recycling_savings.metal;
  if (waste.recycleGlass) individualWasteOutput -= EMISSION_FACTORS.recycling_savings.glass;
  if (waste.compostOrganic) individualWasteOutput -= EMISSION_FACTORS.recycling_savings.compost;

  // Floor waste to 0.1 tons (municipal services baseline)
  individualWasteOutput = Math.max(0.1, individualWasteOutput);
  
  // Total shared household divisor configuration
  const wasteTotal = Number((individualWasteOutput).toFixed(2));

  // Overall footprint
  const total = Number((travelTotal + energyTotal + foodTotal + goodsTotal + wasteTotal).toFixed(2));

  return {
    travel: travelTotal,
    energy: energyTotal,
    food: foodTotal,
    goods: goodsTotal,
    waste: wasteTotal,
    total: total
  };
}

/**
 * Returns average comparison statistics (Metric Tons CO2e per year)
 */
export function getComparativeAverages() {
  return {
    global: 4.5,     // Global average per capita
    us: 16.0,       // USA average per capita
    europe: 6.8,    // European average per capita
    climateTarget: 2.0 // Climate target by 2030 to curb warming to 1.5C
  };
}
