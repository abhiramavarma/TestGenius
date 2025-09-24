import os
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def _validate_and_filter_test_cases(parsed: dict) -> dict:
    """
    Ensure every test case has a concrete expected_output. Remove invalid ones and
    raise ValueError if none remain.
    """
    if not isinstance(parsed, dict):
        return parsed
    test_cases = parsed.get("test_cases")
    if not isinstance(test_cases, list):
        return parsed
    valid_cases = []
    for case in test_cases:
        try:
            value = case.get("expected_output")
            if isinstance(value, str):
                lowered = value.strip().lower()
                if lowered in {"", "undefined", "null", "n/a", "na"}:
                    continue
            if value is None:
                continue
            valid_cases.append(case)
        except Exception:
            continue
    if not valid_cases:
        raise ValueError("All generated test cases had invalid expected_output values.")
    parsed["test_cases"] = valid_cases
    return parsed

def _extract_json_from_text(text: str) -> str:
    """
    Extract the first valid JSON object substring from arbitrary text.
    Handles code fences and stray prose. Returns original text if none found.
    """
    if not isinstance(text, str):
        return text

    stripped = text.strip()
    if stripped.startswith("{") and stripped.endswith("}"):
        return stripped

    for fence in ("```json", "```JSON", "```", "\u200b"):
        stripped = stripped.replace(fence, "")

    in_string = False
    escape = False
    depth = 0
    start_idx = -1
    for idx, ch in enumerate(stripped):
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue
        else:
            if ch == '"':
                in_string = True
                continue
            if ch == '{':
                if depth == 0:
                    start_idx = idx
                depth += 1
                continue
            if ch == '}':
                if depth > 0:
                    depth -= 1
                    if depth == 0 and start_idx != -1:
                        candidate = stripped[start_idx:idx+1]
                        return candidate.strip()
    return text

def generate_test_json_from_dsa(api_key: str, dsa_question: str) -> str:
    """
    Uses the Gemini API via LangChain to convert a DSA question into a structured JSON object.
    """
    # Set the API key as an environment variable for LangChain to use
    os.environ["GOOGLE_API_KEY"] = api_key

    # Initialize the Gemini model
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.1,
        convert_system_message_to_human=True,
    ).bind(response_mime_type="application/json")

    # Define the prompt template
    system_prompt = """
You are TestGenius, an AI system that powers a LeetCode-style application for automatic test case generation and solution validation. Your role is to parse DSA problems, generate test cases (including edge/boundary cases), and validate user-provided code against them. You must always produce structured, deterministic, and logically consistent JSON outputs.

Based on the problem, perform the following tasks:
1) Parse the problem into a structured format. Infer reasonable constraints if missing.
2) Generate diverse test cases: normal, edge, boundary, and random. Provide expected outputs.

Output strictly a single JSON object. Do not add any prose or code fences. Do not include markdown.

Schema:
{
  "problem": {
    "title": string,
    "description": string,
    "input_format": string,
    "output_format": string,
    "constraints": string[],
    "function_signature": string
  },
  "test_cases": [
    { "input": any, "expected_output": any, "type": "normal"|"edge"|"boundary"|"random", "explanation": string }
  ]
}
    """

    # Create the full prompt with the user's question
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Here is the DSA question: '{dsa_question}'")
    ]

    # Invoke the model and get the response
    try:
        response = llm.invoke(messages)
        content_string = response.content
        
        # Extract JSON and format
        json_string = _extract_json_from_text(content_string)
        parsed_json = json.loads(json_string)
        parsed_json = _validate_and_filter_test_cases(parsed_json)
        return json.dumps(parsed_json, indent=2)

    except Exception as e:
        return f"An error occurred: {e}"

@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_test():
    """API endpoint to generate test JSON from DSA question"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        dsa_question = data.get('dsa_question', '').strip()
        api_key = data.get('api_key', '').strip()
        
        # Use environment variable if no API key provided in request
        if not api_key:
            api_key = os.getenv('GEMINI_API_KEY')
            
        if not dsa_question:
            return jsonify({'error': 'DSA question is required'}), 400
            
        if not api_key:
            return jsonify({'error': 'API key is required. Please provide it in the request or set GEMINI_API_KEY environment variable.'}), 400
        
        # Generate the test JSON
        result = generate_test_json_from_dsa(api_key, dsa_question)
        
        # Check if the result is an error message
        if result.startswith("An error occurred:"):
            return jsonify({'error': result}), 500
        
        # Parse the JSON to ensure it's valid
        try:
            parsed_result = json.loads(result)
            return jsonify({
                'success': True,
                'result': parsed_result,
                'formatted_json': result
            })
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON response from API'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

