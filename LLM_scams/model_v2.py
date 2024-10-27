import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset, Dataset
from sklearn.model_selection import train_test_split
import pandas as pd

# Load your dataset
data_path = 'preprocessed_balanced_dataset.csv'
df = pd.read_csv(data_path)

# Map labels to integers for binary classification
label_mapping = {'scam': 1, 'non_scam': 0}
df['label'] = df['label'].map(label_mapping)

# Split data into training and validation sets
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df['clean_content'].tolist(), df['label'].tolist(), test_size=0.2, random_state=42
)

# Prepare Hugging Face Dataset
train_data = Dataset.from_dict({'text': train_texts, 'label': train_labels})
val_data = Dataset.from_dict({'text': val_texts, 'label': val_labels})

# Initialize the tokenizer and model for Falcon
model_name = "tiiuae/falcon-7b"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

# Tokenize data
def preprocess_function(examples):
    return tokenizer(examples['text'], truncation=True, padding='max_length', max_length=128)

train_data = train_data.map(preprocess_function, batched=True)
val_data = val_data.map(preprocess_function, batched=True)

# Set up training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=2,  # Adjust based on GPU memory
    per_device_eval_batch_size=2,
    num_train_epochs=3,
    weight_decay=0.01,
    fp16=True  # Mixed precision for memory efficiency on compatible GPUs
)

# Define compute metrics for classification
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = torch.argmax(logits, dim=-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, predictions, average='binary')
    acc = accuracy_score(labels, predictions)
    return {"accuracy": acc, "f1": f1, "precision": precision, "recall": recall}

# Initialize the Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_data,
    eval_dataset=val_data,
    compute_metrics=compute_metrics
)

# Start training
trainer.train()

# Evaluate the model on validation set
results = trainer.evaluate()
print("Evaluation results:", results)
