'use server';
/**
 * @fileOverview Generates test cases from a problem description using AI.
 *
 * - generateTestCasesFromDescription - A function that generates test cases from a problem description.
 * - GenerateTestCasesFromDescriptionInput - The input type for the generateTestCasesFromDescription function.
 * - GenerateTestCasesFromDescriptionOutput - The return type for the generateTestCasesFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesFromDescriptionInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('The description of the coding problem.'),
  code: z.string().optional().describe('Optional code to test against.'),
});
export type GenerateTestCasesFromDescriptionInput =
  z.infer<typeof GenerateTestCasesFromDescriptionInputSchema>;

const TestCaseSchema = z.object({
  input: z.string().describe('The input for the test case.'),
  expectedOutput: z.string().describe('The expected output for the test case.'),
});

const GenerateTestCasesFromDescriptionOutputSchema = z.array(TestCaseSchema);

export type GenerateTestCasesFromDescriptionOutput =
  z.infer<typeof GenerateTestCasesFromDescriptionOutputSchema>;

export async function generateTestCasesFromDescription(
  input: GenerateTestCasesFromDescriptionInput
): Promise<GenerateTestCasesFromDescriptionOutput> {
  return generateTestCasesFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestCasesFromDescriptionPrompt',
  input: {schema: GenerateTestCasesFromDescriptionInputSchema},
  output: {schema: GenerateTestCasesFromDescriptionOutputSchema},
  prompt: `You are an expert software engineer that can generate test cases for a given problem description.

  Generate multiple test cases, including normal, boundary, and edge cases, based on the problem statement.

  Problem Description: {{{problemDescription}}}

  The test cases must include the input and expected output.
  The output must be valid JSON array of test cases.
  Each test case must have the following format:
  {
    "input": "input",
    "expectedOutput": "expected output",
  }
  `,
});

const generateTestCasesFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFromDescriptionFlow',
    inputSchema: GenerateTestCasesFromDescriptionInputSchema,
    outputSchema: GenerateTestCasesFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
