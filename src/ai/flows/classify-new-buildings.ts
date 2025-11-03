'use server';

/**
 * @fileOverview AI-powered building classification flow using satellite imagery.
 *
 * - classifyNewBuilding - Classifies new buildings from satellite imagery and identifies potentially unregistered properties.
 * - ClassifyNewBuildingInput - The input type for the classifyNewBuilding function.
 * - ClassifyNewBuildingOutput - The return type for the classifyNewBuilding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyNewBuildingInputSchema = z.object({
  satelliteImageDataUri: z
    .string()
    .describe(
      "A satellite image of a building, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  buildingGeolocation: z.string().describe('The geolocation of the building (e.g., latitude, longitude).'),
});
export type ClassifyNewBuildingInput = z.infer<typeof ClassifyNewBuildingInputSchema>;

const ClassifyNewBuildingOutputSchema = z.object({
  buildingType: z.string().describe('The classification of the building (e.g., residential, commercial, industrial).'),
  isRegistered: z.boolean().describe('Whether the building is registered in the government database.'),
  confidenceScore: z.number().describe('The confidence score of the classification (0-1).'),
  reviewRequired: z.boolean().describe('Whether a manual review is required for this building.'),
});
export type ClassifyNewBuildingOutput = z.infer<typeof ClassifyNewBuildingOutputSchema>;

export async function classifyNewBuilding(input: ClassifyNewBuildingInput): Promise<ClassifyNewBuildingOutput> {
  return classifyNewBuildingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyNewBuildingPrompt',
  input: {schema: ClassifyNewBuildingInputSchema},
  output: {schema: ClassifyNewBuildingOutputSchema},
  prompt: `You are an AI-powered building classification system for the Nigerian government.
  You analyze satellite imagery to classify new buildings and determine if they are registered.

  Analyze the following satellite image:
  {{media url=satelliteImageDataUri}}

  Building Geolocation: {{{buildingGeolocation}}}

  Determine the building type (residential, commercial, industrial, or institutional).
  Check if the building is registered in the government database. If unsure, attempt to retrieve building records using geolocation.
  Provide a confidence score for the classification.
  Indicate if a manual review is required.

  Output the classification result in JSON format:
  {
    "buildingType": "<building type>",
    "isRegistered": <true/false>,
    "confidenceScore": <0-1>,
    "reviewRequired": <true/false>
  }
  `,
});

const classifyNewBuildingFlow = ai.defineFlow(
  {
    name: 'classifyNewBuildingFlow',
    inputSchema: ClassifyNewBuildingInputSchema,
    outputSchema: ClassifyNewBuildingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
