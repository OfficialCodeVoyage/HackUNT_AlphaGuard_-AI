# audio_processing/scam_detection.py

import os
import openai
import logging
import json

logger = logging.getLogger('audio_processing')

# Set the OpenAI API key
openai.api_key = "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"  # Or use settings.OPENAI_API_KEY if using Django settings

def check_scam(transcript):
    """
    Uses OpenAI's API to determine if the transcript is a scam call.

    Parameters:
        transcript (str): The cumulative transcript.

    Returns:
        dict: A dictionary containing the scam determination, scam score, and explanation.
    """
    try:
        # Define the prompt focused on scam detection
        prompt = f"""
You are an AI assistant that analyzes conversation transcripts to determine if they are scam calls. A scam call is one where the caller attempts to deceive the recipient into sharing private information, such as credentials, financial details, or tries to create a sense of urgency to prompt immediate action.

Transcript:
\"\"\"
{transcript}
\"\"\"

Please answer the following questions:
1. Is the above transcript a scam call? Answer "Yes" or "No".
2. Provide a scam score between 0 and 1, where 0 means not a scam at all and 1 means definitely a scam.
3. Briefly explain your reasoning.

Provide your answer in the following JSON format:
{{
    "is_scam": "Yes" or "No",
    "scam_score": float between 0 and 1,
    "explanation": "Your brief reasoning here"
}}
"""
        # Create a completion using the ChatCompletion API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use an appropriate model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=250,
            temperature=0,
        )

        # Extract the assistant's reply
        result_text = response['choices'][0]['message']['content'].strip()

        # Parse the JSON response
        try:
            scam_result = json.loads(result_text)
        except json.JSONDecodeError:
            logger.error("Failed to parse OpenAI response as JSON.")
            scam_result = {
                "is_scam": "Unknown",
                "scam_score": 0,
                "explanation": "Could not parse the response."
            }

        return scam_result

    except Exception as e:
        logger.error(f"Error during scam detection: {e}")
        return {
            "is_scam": "Unknown",
            "scam_score": 0,
            "explanation": "An error occurred during scam detection."
        }
