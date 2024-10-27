from flask import Flask, request, jsonify
from transformers import BertTokenizerFast, BertForSequenceClassification
import torch

# Initialize the model and tokenizer
model_name = "bert-base-uncased"
tokenizer = BertTokenizerFast.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(model_name, num_labels=2)

# Set up Flask app
app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    # Get JSON data
    data = request.get_json()
    text = data["text"]

    # Tokenize and prepare inputs
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)

    # Get the predicted label and confidence
    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=1)
    confidence, predicted_label = torch.max(probabilities, dim=1)

    # Convert to response
    response = {
        "label": "scam" if predicted_label.item() == 1 else "non_scam",
        "confidence": confidence.item()
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
