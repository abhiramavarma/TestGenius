"use server";

import { improveTestCasesWithAI, ImproveTestCasesWithAIInput } from "@/ai/flows/improve-test-cases-with-ai";

type ActionResponse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};

export async function generateTestCasesAction(input: {problemDescription: string, providedCode?: string}): Promise<ActionResponse<Array<{input: string, expectedOutput: string, reasoning?: string}>>> {
    try {
        const aiInput: ImproveTestCasesWithAIInput = {
            problemDescription: input.problemDescription,
            providedCode: input.providedCode || undefined,
        };

        const result = await improveTestCasesWithAI(aiInput);
        
        return {
            success: true,
            data: result.improvedTestCases
        };
    } catch (error) {
        console.error("Error generating test cases:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred."
        };
    }
}
