# audio_processing/nlp_analysis.py

from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

endpoint = 'https://hackathonnlp.cognitiveservices.azure.com/'
key = 'EGtt0OviOQwwKRouADUXcXqxMT4A0qfpQ7JtCS16FzOHpmtI6dQzJQQJ99AJACYeBjFXJ3w3AAAaACOGaofk'

text_analytics_client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))

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
    return analysis_results

