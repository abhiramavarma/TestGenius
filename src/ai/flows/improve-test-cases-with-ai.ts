'use server';
/**
 * @fileOverview This file defines a Genkit flow to improve test case generation and refine expected outputs using AI, based on a problem description and optional code.
 *
 * @function improveTestCasesWithAI - The main function to improve test cases with AI.
 * @typedef {ImproveTestCasesWithAIInput} ImproveTestCasesWithAIInput - The input type for the improveTestCasesWithAI function.
 * @typedef {ImproveTestCasesWithAIOutput} ImproveTestCasesWithAIOutput - The output type for the improveTestCasesWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTestCasesWithAIInputSchema = z.object({
  problemDescription: z.string().describe('The description of the coding problem.'),
  providedCode: z.string().optional().describe('Optional: The code provided by the user (Python, C++, or Java).'),
  existingTestCases: z.array(
    z.object({
      input: z.string().describe('Test case input.'),
      expectedOutput: z.string().describe('Expected output for the test case.'),
    })
  ).optional().describe('Optional: Existing test cases to improve.'),
});

export type ImproveTestCasesWithAIInput = z.infer<typeof ImproveTestCasesWithAIInputSchema>;

const ImproveTestCasesWithAIOutputSchema = z.object({
  improvedTestCases: z.array(
    z.object({
      input: z.string().describe('Improved test case input.'),
      expectedOutput: z.string().describe('Improved expected output for the test case.'),
      reasoning: z.string().describe('Reasoning for the test case and expected output.'),
    })
  ).describe('Array of improved test cases with refined expected outputs.'),
});

export type ImproveTestCasesWithAIOutput = z.infer<typeof ImproveTestCasesWithAIOutputSchema>;

export async function improveTestCasesWithAI(input: ImproveTestCasesWithAIInput): Promise<ImproveTestCasesWithAIOutput> {
  return improveTestCasesWithAIFlow(input);
}

const improveTestCasesPrompt = ai.definePrompt({
  name: 'improveTestCasesPrompt',
  input: {schema: ImproveTestCasesWithAIInputSchema},
  output: {schema: ImproveTestCasesWithAIOutputSchema},
  prompt: `You are an expert software engineer specializing in creating comprehensive test cases for coding problems.

  Given the following problem description, generate a diverse set of test cases, including normal cases, boundary cases, and edge cases. Each test case should have a clear input and a well-defined expected output. Explain your reasoning for each test case, considering potential edge cases, common errors, and performance bottlenecks.
  
  Problem Description: {{{problemDescription}}}

  {{#if providedCode}}
  Consider the following code provided by the user when generating test cases and expected outputs:
  \`\`\`
  {{{providedCode}}}
  \`\`\`
  {{~/if}}

  {{#if existingTestCases}}
  Improve the following existing test cases:
  {{#each existingTestCases}}
  - Input: {{{this.input}}}, Expected Output: {{{this.expectedOutput}}}
  {{/each}}
  {{~/if}}
  
  Return the test cases in JSON format.
  `,
});

const improveTestCasesWithAIFlow = ai.defineFlow(
  {
    name: 'improveTestCasesWithAIFlow',
    inputSchema: ImproveTestCasesWithAIInputSchema,
    outputSchema: ImproveTestCasesWithAIOutputSchema,
  },
  async input => {
    const {output} = await improveTestCasesPrompt(input);
    return output!;
  }
);
