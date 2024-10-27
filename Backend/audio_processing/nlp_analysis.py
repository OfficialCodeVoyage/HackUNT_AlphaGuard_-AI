from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

endpoint = 'https://hackathonnlp.cognitiveservices.azure.com/'
key = 'EGtt0OviOQwwKRouADUXcXqxMT4A0qfpQ7JtCS16FzOHpmtI6dQzJQQJ99AJACYeBjFXJ3w3AAAaACOGaofk'

text_analytics_client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))

# Common scam indicators and categories
SCAM_INDICATORS = {
    "urgent_phrases": ["act now", "limited time", "urgent action required", "expires soon", "don't wait"],
    "threat_phrases": ["legal action", "arrest", "criminal charges", "security breach", "identity theft"],
    "credential_requests": ["verify account", "confirm identity", "password", "social security", "bank information"],
    "authority_claims": ["government", "tax authority", "fraud department", "microsoft support"],
    "reward_baits": ["you've won", "prize", "reward", "claim your funds"],
}

def calculate_scam_score(analysis_results):
    score = 0.0

    # Increase score if sentiment is overly negative or overly positive (for urgency)
    if analysis_results['sentiment'] == 'negative' and analysis_results['sentiment_scores']['negative'] > 0.6:
        score += 0.2
    elif analysis_results['sentiment'] == 'positive' and analysis_results['sentiment_scores']['positive'] > 0.6:
        score += 0.1

    # Check for scam-indicative entities and key phrases
    entities = [entity['text'].lower() for entity in analysis_results['entities']]
    key_phrases = [phrase.lower() for phrase in analysis_results['key_phrases']]

    for category, phrases in SCAM_INDICATORS.items():
        for phrase in phrases:
            if any(phrase in entity for entity in entities) or any(phrase in key_phrase for key_phrase in key_phrases):
                # Assign weights to categories
                if category == "credential_requests":
                    score += 0.4
                elif category == "threat_phrases":
                    score += 0.3
                elif category == "urgent_phrases" or category == "reward_baits":
                    score += 0.2
                elif category == "authority_claims":
                    score += 0.15

    # Clamp the score between 0 and 1
    score = min(score, 1.0)
    return score

def analyze_transcript(transcript):
    documents = [transcript]

    # Sentiment Analysis
    sentiment_response = text_analytics_client.analyze_sentiment(documents=documents)[0]
    sentiment = sentiment_response.sentiment
    sentiment_scores = sentiment_response.confidence_scores

    # Entity Recognition
    entities_response = text_analytics_client.recognize_entities(documents=documents)[0]
    entities = [
        {
            'text': entity.text,
            'category': entity.category,
            'subcategory': entity.subcategory,
            'confidence_score': entity.confidence_score
        } for entity in entities_response.entities
    ]

    # Key Phrase Extraction
    key_phrases_response = text_analytics_client.extract_key_phrases(documents=documents)[0]
    key_phrases = key_phrases_response.key_phrases

    # Compile the analysis results
    analysis_results = {
        'sentiment': sentiment,
        'sentiment_scores': {
            'positive': sentiment_scores.positive,
            'neutral': sentiment_scores.neutral,
            'negative': sentiment_scores.negative,
        },
        'entities': entities,
        'key_phrases': key_phrases,
    }

    # Calculate scam score
    scam_score = calculate_scam_score(analysis_results)
    is_scam = scam_score > 0.5  # You can adjust the threshold

    result = {
        'is_scam': is_scam,
        'scam_score': scam_score,
        'analysis_results': analysis_results,
        'recommendation': "Suspicious, review needed" if is_scam else "Likely safe",
    }

    return result
