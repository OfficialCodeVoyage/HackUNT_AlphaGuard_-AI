# audio_processing/scam_detection.py

import os
import openai
import logging
import json
from typing import Dict, List, Union

logger = logging.getLogger('audio_processing')

# Set the OpenAI API key
openai.api_key = "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"

# Common scam indicators and phrases
SCAM_INDICATORS = {
    "urgency_phrases": [
        "act now", "limited time", "expires soon", "urgent action required",
        "immediate action", "don't wait", "time sensitive", "act immediately",
        "running out of time", "deadline approaching", "last chance"
    ],
    "threat_phrases": [
        "account suspended", "legal action", "police involvement", "arrest warrant",
        "lawsuit pending", "criminal charges", "account compromised", "security breach",
        "unauthorized access", "identity theft", "fraud alert"
    ],
    "credential_requests": [
        "verify password", "confirm social security", "provide account details",
        "bank information needed", "credit card verification", "update payment info",
        "confirm identity", "verify account", "login credentials", "security questions"
    ],
    "pressure_tactics": [
        "today only", "one-time offer", "exclusive offer", "special promotion",
        "nobody else knows", "keep this confidential", "don't tell anyone",
        "between us only", "secret deal", "selected customer"
    ],
    "authority_claims": [
        "government agency", "irs agent", "social security administration",
        "microsoft support", "apple security", "bank security team",
        "fraud department", "federal agent", "tax authority"
    ],
    "reward_baits": [
        "you've won", "lottery winner", "prize claim", "free gift",
        "cash reward", "inheritance money", "unclaimed funds",
        "compensation waiting", "refund due", "cashback available"
    ]
}

def calculate_phrase_matches(transcript: str) -> Dict[str, List[str]]:
    """
    Identifies matching scam phrases in the transcript.
    
    Parameters:
        transcript (str): The text to analyze
            
    Returns:
        Dict[str, List[str]]: Dictionary of matched phrases by category
    """
    transcript_lower = transcript.lower()
    matches = {}
    
    for category, phrases in SCAM_INDICATORS.items():
        found_phrases = [
            phrase for phrase in phrases
            if phrase.lower() in transcript_lower
        ]
        if found_phrases:
            matches[category] = found_phrases
                
    return matches

def calculate_base_risk_score(matches: Dict[str, List[str]]) -> float:
    """
    Calculates initial risk score based on phrase matches.
    
    Parameters:
        matches (Dict[str, List[str]]): Dictionary of matched phrases
            
    Returns:
        float: Base risk score between 0 and 1
    """
    if not matches:
        return 0.0
        
    # Weight each category differently
    category_weights = {
        "credential_requests": 0.4,
        "urgency_phrases": 0.2,
        "threat_phrases": 0.3,
        "pressure_tactics": 0.2,
        "authority_claims": 0.15,
        "reward_baits": 0.25
    }
    
    total_weight = sum(category_weights.values())
    score = sum(
        category_weights[category] * (len(phrases) / len(SCAM_INDICATORS[category]))
        for category, phrases in matches.items()
        if category in category_weights
    )
    
    return min(1.0, score / total_weight)

def check_scam(transcript: str) -> Dict[str, Union[str, float, dict, str]]:
    """
    Enhanced scam detection using OpenAI's API and pattern matching.

    Parameters:
        transcript (str): The cumulative transcript.

    Returns:
        dict: Contains scam determination, confidence score, matched phrases, and explanation.
    """
    try:
        # First perform pattern matching
        phrase_matches = calculate_phrase_matches(transcript)
        base_risk_score = calculate_base_risk_score(phrase_matches)
        
        # Construct an enhanced prompt with specific guidance
        prompt = f"""
Analyze this conversation transcript for potential scam indicators. Consider:

1. Urgency and pressure tactics
2. Requests for sensitive information
3. Suspicious authority claims
4. Unusual rewards or threats
5. Manipulation techniques
6. Grammar and language patterns

Transcript:
\"\"\"
{transcript}
\"\"\"

Known suspicious phrases detected: {json.dumps(phrase_matches, indent=2)}
Base risk score from phrase analysis: {base_risk_score:.2f}

Please provide:
1. Is this a scam? Answer "Yes", "No", or "Suspicious"
2. Confidence score (0-1)
3. Top 3 concerning elements (if any)
4. Recommended action for the recipient

Format response as JSON:
{{
    "is_scam": "Yes/No/Suspicious",
    "confidence_score": float,
    "concerning_elements": [list of strings],
    "recommended_action": "string",
    "explanation": "string"
}}
"""
        # Create a completion using the ChatCompletion API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a fraud detection expert focused on identifying scam patterns and protecting potential victims."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.1,
        )

        # Extract and parse the response
        result_text = response['choices'][0]['message']['content'].strip()
        try:
            ai_analysis = json.loads(result_text)
        except json.JSONDecodeError:
            logger.error("Failed to parse OpenAI response as JSON")
            ai_analysis = {
                "is_scam": "Unknown",
                "confidence_score": 0.0,
                "concerning_elements": [],
                "recommended_action": "Manual review required",
                "explanation": "Error parsing AI response"
            }

        # Combine pattern matching and AI analysis
        final_score = (base_risk_score + float(ai_analysis.get('confidence_score', 0))) / 2

        return {
            "is_scam": ai_analysis.get('is_scam', 'Unknown'),
            "scam_score": final_score,
            "matched_phrases": phrase_matches,
            "ai_analysis": ai_analysis,
            "base_risk_score": base_risk_score,
            "explanation": ai_analysis.get('explanation', ''),
            "recommended_action": ai_analysis.get('recommended_action', '')
        }

    except Exception as e:
        logger.error(f"Error during scam detection: {str(e)}")
        return {
            "is_scam": "Error",
            "scam_score": 0.0,
            "matched_phrases": {},
            "ai_analysis": None,
            "base_risk_score": 0.0,
            "explanation": f"An error occurred during analysis: {str(e)}",
            "recommended_action": "Manual review required"
        }
