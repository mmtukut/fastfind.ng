'use server';

/**
 * @fileOverview A Genkit flow that attempts to retrieve building records using geolocation.
 *
 * - retrieveBuildingRecords - A function that handles the retrieval of building records.
 * - RetrieveBuildingRecordsInput - The input type for the retrieveBuildingRecords function.
 * - RetrieveBuildingRecordsOutput - The return type for the retrieveBuildingRecords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveBuildingRecordsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the building.'),
  longitude: z.number().describe('The longitude of the building.'),
});
export type RetrieveBuildingRecordsInput = z.infer<typeof RetrieveBuildingRecordsInputSchema>;

const RetrieveBuildingRecordsOutputSchema = z.object({
  records: z.string().describe('The building records retrieved using geolocation.'),
});
export type RetrieveBuildingRecordsOutput = z.infer<typeof RetrieveBuildingRecordsOutputSchema>;

export async function retrieveBuildingRecords(input: RetrieveBuildingRecordsInput): Promise<RetrieveBuildingRecordsOutput> {
  return retrieveBuildingRecordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retrieveBuildingRecordsPrompt',
  input: {schema: RetrieveBuildingRecordsInputSchema},
  output: {schema: RetrieveBuildingRecordsOutputSchema},
  prompt: `You are a government administrator tasked with retrieving building records using geolocation.
  Using the provided latitude and longitude, retrieve any available building records.
  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}
  `,
});

const retrieveBuildingRecordsFlow = ai.defineFlow(
  {
    name: 'retrieveBuildingRecordsFlow',
    inputSchema: RetrieveBuildingRecordsInputSchema,
    outputSchema: RetrieveBuildingRecordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
