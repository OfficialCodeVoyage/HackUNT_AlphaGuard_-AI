import json
import joblib
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from azureml.core.model import Model

# Download NLTK data
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize tools
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()


def init():
    global model
    global vectorizer
    # Load the model
    model_path = Model.get_model_path('XGBoost_ScamDetector')
    model = joblib.load(model_path)

    # Load the vectorizer
    vectorizer_path = Model.get_model_path('TFIDF_Vectorizer')
    vectorizer = joblib.load(vectorizer_path)


def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Tokenize
    words = text.split()
    # Remove stop words
    words = [word for word in words if word not in stop_words]
    # Lemmatize
    words = [lemmatizer.lemmatize(word) for word in words]
    # Rejoin
    return ' '.join(words)


def run(data):
    try:
        # Parse input data
        data = json.loads(data)
        transcript = data['transcript']

        # Preprocess
        processed_transcript = preprocess_text(transcript)

        # Vectorize
        X = vectorizer.transform([processed_transcript])

        # Predict probability
        scam_prob = model.predict_proba(X)[0][1]

        return json.dumps({"scam_probability": scam_prob})
    except Exception as e:
        return json.dumps({"error": str(e)})
