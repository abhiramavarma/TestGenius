# 🚀 TestGenius – TestCases Generator

A beautiful web application that transforms DSA (Data Structures and Algorithms) questions into structured JSON test cases using Google's Gemini AI.

## ✨ Features

- **Beautiful Modern UI**: Clean, responsive design with gradient backgrounds and smooth animations
- **AI-Powered Generation**: Uses Google Gemini API to convert DSA questions into structured test cases
- **Real-time Processing**: Instant generation with loading states and error handling
- **Copy to Clipboard**: Easy copying of generated JSON
- **Example DSA Questions**: Pre-built examples to get you started
- **API Key Security**: Support for environment variables or user input
- **Mobile Responsive**: Works perfectly on desktop and mobile devices

## 🛠️ Installation

1. **Clone or download the project files**

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up your API key**:
   
   **Option A: Environment Variable (Recommended for production)**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```
   
   **Option B: Enter in the web interface**
   - The web app will remember your API key in the browser

5. **Get your Gemini API key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file or enter it in the web interface

## 🚀 Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## 📖 How to Use

1. **Enter your Gemini API key** (if not set as environment variable)
2. **Type or select a DSA question** describing the test case you want to generate
3. **Click "Generate Test Case"** and wait for the AI to process your request
4. **View the structured JSON output** with syntax highlighting
5. **Copy the JSON** using the copy button for use in your projects

## 💡 Example DSA Questions

- "Check whether the given number is even or odd? n ranges from 1 to 40."
- "Create a function that calculates the factorial of a non-negative integer."
- "Write a function to find the maximum element in an array of integers."
- "Implement a function that checks if a string is a palindrome."
- "Create a function that sorts an array of objects by a specific property."
- "Find the longest common subsequence between two strings."
- "Implement binary search on a sorted array."
- "Check if a binary tree is balanced."

## 🏗️ Project Structure

```
├── app.py                 # Flask backend application
├── generate_test.py       # Original Python script
├── requirements.txt       # Python dependencies
├── .gitignore            # Git ignore file
├── .env.example          # Environment variables template
├── templates/
│   └── index.html        # Frontend HTML template
└── README.md             # This file
```

## 🔧 Configuration

The application supports the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `FLASK_ENV`: Flask environment (development/production)
- `FLASK_DEBUG`: Enable/disable Flask debug mode

## 🎨 Features in Detail

### Frontend
- **Modern Design**: Gradient backgrounds, glassmorphism effects, and smooth animations
- **Responsive Layout**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Syntax Highlighting**: JSON output with proper formatting
- **Copy Functionality**: One-click copying of generated content
- **Example Integration**: Click-to-use example DSA questions

### Backend
- **Flask API**: RESTful API endpoints for processing requests
- **Error Handling**: Comprehensive error handling and user feedback
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Variables**: Secure API key management
- **JSON Validation**: Ensures proper JSON output format

## 🔒 Security Notes

- API keys are handled securely with environment variable support
- CORS is enabled for development; configure appropriately for production
- Input validation is performed on both frontend and backend
- No API keys are logged or stored permanently in the application

## 🐛 Troubleshooting

### Common Issues:

1. **"API key is required" error**:
   - Ensure you've entered your Gemini API key correctly
   - Check that the API key has the necessary permissions

2. **"Invalid JSON response" error**:
   - The Gemini API might be experiencing issues
   - Try rephrasing your DSA question
   - Check your internet connection

3. **Port already in use**:
   - Change the port in `app.py` from 5000 to another available port
   - Or kill the process using port 5000

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please create an issue in the project repository.
