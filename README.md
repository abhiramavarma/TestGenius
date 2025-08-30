# TestGenius

A web application for generating and running test cases for coding problems. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Test Case Generation**: Automatically generate comprehensive test cases from problem descriptions
- **Multi-Language Support**: Supports Python, C++, Java, and JavaScript
- **Code Execution**: Run your code against generated test cases in a secure environment
- **Visual Results**: View test results in a clean, organized table format
- **Export Functionality**: Download test cases as JSON for reuse
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Code Editor**: Monaco Editor
- **Backend**: Next.js API routes
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/testgenius.git
cd testgenius
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:9002](http://localhost:9002) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Describe Your Problem**: Enter a detailed description of the coding problem you want to test.

2. **Provide Code (Optional)**: Add your solution code in the supported languages for more accurate test case generation.

3. **Generate Test Cases**: Click the "Generate Test Cases" button to create comprehensive test cases.

4. **Run Tests**: Execute your code against the generated test cases to see the results.

5. **Export Results**: Download the test cases as JSON for future use or sharing.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── actions.ts       # Server actions for test generation
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── test-genius.tsx # Main application component
├── ai/                 # AI-related functionality
│   ├── flows/          # AI workflow definitions
│   └── genkit.ts       # AI configuration
└── lib/                # Utility functions
    └── utils.ts        # Helper functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
