'use server';
/**
 * @fileOverview A flow for correcting spelling and grammar in a given text.
 *
 * - spellCheck - A function that corrects the spelling and grammar of a given text.
 * - SpellCheckInput - The input type for the spellCheck function.
 * - SpellCheckOutput - The return type for the spellCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpellCheckInputSchema = z.object({
  text: z.string().describe('The text to be corrected.'),
});
export type SpellCheckInput = z.infer<typeof SpellCheckInputSchema>;

const SpellCheckOutputSchema = z.object({
  correctedText: z.string().describe('The corrected text.'),
});
export type SpellCheckOutput = z.infer<typeof SpellCheckOutputSchema>;

export async function spellCheck(
  input: SpellCheckInput
): Promise<SpellCheckOutput> {
  return spellCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spellCheckPrompt',
  input: {schema: SpellCheckInputSchema},
  output: {schema: SpellCheckOutputSchema},
  prompt: `You are an expert in English grammar and spelling. Correct the following text for any spelling and grammatical errors. Only return the corrected text.

Text to correct: {{{text}}}
`,
});

const spellCheckFlow = ai.defineFlow(
  {
    name: 'spellCheckFlow',
    inputSchema: SpellCheckInputSchema,
    outputSchema: SpellCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
