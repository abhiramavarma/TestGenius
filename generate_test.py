import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage

def _validate_and_filter_test_cases(parsed: dict) -> dict:
    """
    Ensure every test case has a concrete expected_output. Remove any invalid ones.
    Invalid means missing, None, empty string, or textual placeholders like 'undefined', 'null', 'n/a'.
    Raises ValueError if all test cases are invalid after filtering.
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

    Handles cases where the model wraps JSON in code fences or adds prose.
    Returns the JSON substring if found; otherwise returns the original text.
    """
    if not isinstance(text, str):
        return text

    # Quick path: already looks like JSON
    stripped = text.strip()
    if stripped.startswith("{") and stripped.endswith("}"):
        return stripped

    # Remove common code fences
    for fence in ("```json", "```JSON", "```", "\u200b"):
        stripped = stripped.replace(fence, "")

    # Scan for the first balanced JSON object
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

    Args:
        api_key: Your Gemini API key.
        dsa_question: The DSA question text you want to process.

    Returns:
        A formatted JSON string representing the test case.
        Returns an error message string if something goes wrong.
    """
    # Set the API key as an environment variable for LangChain to use
    os.environ["GOOGLE_API_KEY"] = api_key

    # 1. Initialize the Gemini model
    # We use model_kwargs to specify that the output should be a JSON object.
    # This is a powerful feature that ensures the model's response is valid JSON.
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.1, # Lower temperature for more predictable, structured output
        convert_system_message_to_human=True, # Helps with some models
    ).bind(response_mime_type="application/json")


    # 2. Define the prompt template
    # This system message gives the model its instructions. It's a "zero-shot" prompt
    # where we tell it exactly what to do and what format to use.
    system_prompt = """
     You are an expert software quality assurance engineer. Your task is to analyze a given DSA (Data Structures and Algorithms) question and generate a structured JSON object based on it.

     The JSON object MUST strictly follow this structure:
     {
       "test_description": "A brief, one-sentence summary of the test's purpose.",
       "description": "A detailed explanation of the problem or the function to be tested.",
       "input": "A description of the input format (e.g., 'a string of numbers', 'an array of objects').",
       "expected_output": "A description of the expected output format (e.g., 'an integer representing the sum', 'a sorted array').",
       "test_cases": [
         {
           "input": "A concrete example of an input.",
           "output": "The corresponding expected output for that input.",
           "explanation": "A brief explanation of why this input produces this output short and sweet in point."
         }
       ]
     }

     Strict requirements:
     - Compute the exact expected_output for every test case. It must be a concrete value, not a placeholder.
     - Never use undefined, null, empty string, or placeholders like 'N/A' for expected_output.
     - Output only raw JSON. Do not include markdown or code fences.
     """

    # 3. Create the full prompt with the user's question
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Here is the DSA question: '{dsa_question}'")
    ]

    # 4. Invoke the model and get the response
    print("🤖 Sending request to Gemini API...")
    try:
        response = llm.invoke(messages)
        # The response.content will be a JSON string because we specified the mime type
        content_string = response.content
        
        # 5. Extract, parse and format the JSON for clean printing
        json_string = _extract_json_from_text(content_string)
        parsed_json = json.loads(json_string)
        parsed_json = _validate_and_filter_test_cases(parsed_json)
        return json.dumps(parsed_json, indent=2)

    except Exception as e:
        return f"An error occurred: {e}"

# --- Main execution block ---
if __name__ == "__main__":
    # ❗️ IMPORTANT: Replace with your actual Gemini API key
    my_api_key = "YOUR_GEMINI_API_KEY"

    # 👉 Your DSA question goes here
    # Example 1: A simple arithmetic operation
    # dsa_question = "Create a function that calculates the factorial of a non-negative integer."

    # Example 2: A more complex string manipulation task
    dsa_question = "Check whether the given number is even or odd? n ranges from 1 to 40. "


    if my_api_key == "YOUR_GEMINI_API_KEY":
        print("🚨 Error: Please replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key.")
    else:
        # Generate the JSON
        result_json = generate_test_json_from_dsa(api_key=my_api_key, dsa_question=dsa_question)

        # Print the final result
        print("\n✅ Successfully generated JSON from DSA question:")
        print("--------------------------------------------------")
        print(result_json)
        print("--------------------------------------------------")