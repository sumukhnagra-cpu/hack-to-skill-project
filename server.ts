/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Initialize Gemini SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 2. AI recommendations proxy router
app.post('/api/ai-recommendations', async (req, res) => {
  try {
    const { results, inputs } = req.body;

    if (!inputs || !results) {
      return res.status(400).json({ error: 'Missing calculation inputs or results parameters.' });
    }

    if (!ai) {
      return res.status(503).json({ 
        error: 'Gemini service is unconfigured. Please ensure GEMINI_API_KEY is configured in your Secrets panel under Settings.' 
      });
    }

    // Construct an optimal system prompt to guide Gemini's feedback format
    const systemInstruction = 
      "You are a professional climate systems scholar and eco-consultant assisting citizens with carbon emission offsets. " +
      "Provide actionable, polite, realistic footprint reduction strategies in elegant markdown format, using bold headers and concise bullet points. " +
      "Give concrete numbers and estimate potential tonnage margins saved.";

    const prompt = 
      `The user has computed their annual carbon emissions. Here is their profile:\n\n` +
      `### CURRENT CARBON SCORE:\n` +
      `- **Overall Total Release**: ${results.total.toFixed(2)} metric tons of CO2e per year.\n` +
      `- **Transport/Travel**: ${results.travel.toFixed(2)} metric tons.\n` +
      `- **Utility Energy**: ${results.energy.toFixed(2)} metric tons.\n` +
      `- **Diet & Food**: ${results.food.toFixed(2)} metric tons.\n` +
      `- **Goods & Purchasing**: ${results.goods.toFixed(2)} metric tons.\n` +
      `- **Household Waste**: ${results.waste.toFixed(2)} metric tons.\n\n` +
      `### DETAILED USER INPUT DETAILS:\n` +
      `- Vehicle Type: ${inputs.travel.carType}, annual driving mileage: ${inputs.travel.carDistance} miles.\n` +
      `- Yearly public transport: ${inputs.travel.publicDistance} miles.\n` +
      `- Flights: Short-haul: ${inputs.travel.flightsShort}, Medium-haul: ${inputs.travel.flightsMedium}, Long-haul: ${inputs.travel.flightsLong}.\n` +
      `- Home electricity: ${inputs.energy.electricityKwh} kWh, green renewable power: ${inputs.energy.greenPowerPct}%.\n` +
      `- Home heating: Natural Gas: ${inputs.energy.gasTherm} Therms, Oil: ${inputs.energy.heatingOilGal} Gallons.\n` +
      `- Food Diet: ${inputs.food.dietType}, Local supply share: ${inputs.food.localFoodPct}%, Food thrown out: ${inputs.food.foodWastePct}%.\n` +
      `- Good items purchasing monthly Clothing: $${inputs.goods.clothingMonthly}, yearly Electronics: $${inputs.goods.electronicsYearly}, Furniture: $${inputs.goods.furnitureYearly}.\n` +
      `- Shared household count: ${inputs.waste.householdSize} people. Recycling plastic: ${inputs.waste.recyclePlastic}, metal: ${inputs.waste.recycleMetal}, paper: ${inputs.waste.recyclePaper}, glass: ${inputs.waste.recycleGlass}, compost organic: ${inputs.waste.compostOrganic}.\n\n` +
      `Please formulate a personalized 3-part Action Pathway (Short-term, Medium-term, Long-term) structured logically. ` +
      `For each highlighted strategy, explain *why* it helps based on their specs and list an estimated tons of CO2e saved (e.g., "Potential Offset: ~0.50 tons"). ` +
      `Conclude with a warm/encouraging statement about global environment conservation. Keep your advice professional, specific, and mathematically aligned.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Gemini model response failed or empty.');
    }

    res.json({ recommendations: outputText });
  } catch (error: any) {
    console.error('Server Gemini execution failure:', error);
    res.status(500).json({ error: error?.message || 'Server failed to calculate AI suggestions.' });
  }
});

// 3. Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In development mode, mount Vite middleware to serve resources
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[SYSTEM] Mounted Vite Dev Server Middleware.');
  } else {
    // In production mode, serve compiled static site from 'dist' directory
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[SYSTEM] Serving Production statically from dist...');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Carbon Calculator operational on http://localhost:${PORT}`);
  });
}

startServer();
