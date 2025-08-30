# **App Name**: TestGenius

## Core Features:

- Problem Input: Allows users to input a coding problem description in plain text.
- Code Input: Enables users to optionally input their code (Python, C++, or Java).
- Test Case Generation (AI): Uses the Gemini API as a tool to generate test cases (normal, boundary, edge) and expected outputs from the problem statement. Generates test cases and expected outputs even if the code is not provided.
- Code Execution: Executes the user's code against generated test cases in a secure Python sandbox. Functionality only enabled if the code is provided.
- Test Result Display: Presents test results in a table (input, expected output, user output, status).
- Failed Case Highlighting: Visually highlights test cases where the user's code failed.
- Test Case Management: Enables user to save generated Test cases as json on client for reuse and modification

## Style Guidelines:

- Primary color: Sky Blue (#87CEEB). A calming and intelligent color reflecting clarity and trust. It is vibrant enough to draw attention but not so intense that it distracts from code and test results.
- Background color: Light Gray (#F0F0F0). Offers a subtle, neutral backdrop to improve readability.
- Accent color: Salmon (#FA8072). Used for highlighting failed test cases and important interactive elements, chosen for high contrast.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text, providing a balance of technical precision and readability.
- Code font: 'Source Code Pro' (monospace) for displaying code snippets clearly.
- Simple, line-based icons to represent actions (e.g., generate, run) and test status (e.g., pass, fail). Icons should complement the typography in weight and style.
- Split-panel layout with the coding problem & editor on the left, and the test cases & results on the right.
- Subtle transitions and animations for loading states and test execution.