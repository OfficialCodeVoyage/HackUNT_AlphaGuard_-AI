import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments
import torch

# Step 1: Load and inspect data
data_path = 'preprocessed_balanced_dataset.csv'
df = pd.read_csv(data_path)
print(df.head())

# Assuming the dataset has columns "clean_content" and "label" where "label" is either 'scam' or 'non_scam'
df = df[['clean_content', 'label']]

# Map string labels to integers: 'scam' -> 1, 'non_scam' -> 0
label_mapping = {'scam': 1, 'non_scam': 0}
df['label'] = df['label'].map(label_mapping)

# Step 2: Split the data into train and test sets
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df['clean_content'].tolist(), df['label'].tolist(), test_size=0.2, random_state=42
)

# Convert labels to integer type (although they should already be integers after mapping)
train_labels = [int(label) for label in train_labels]
val_labels = [int(label) for label in val_labels]

# Step 3: Initialize tokenizer and tokenize data
tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=128)
val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=128)

# Step 4: Create a Dataset class for PyTorch
class ScamDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(int(self.labels[idx]))  # Ensure label is an integer tensor
        return item

    def __len__(self):
        return len(self.labels)

train_dataset = ScamDataset(train_encodings, train_labels)
val_dataset = ScamDataset(val_encodings, val_labels)

# Step 5: Load model and set up training arguments
model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=2)

training_args = TrainingArguments(
    output_dir='./results',
    evaluation_strategy='epoch',
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir='./logs',
)

# Step 6: Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=lambda p: {
        'accuracy': accuracy_score(p.label_ids, p.predictions.argmax(-1)),
        'f1': classification_report(p.label_ids, p.predictions.argmax(-1), output_dict=True)['1']['f1-score']
    }
)

# Step 7: Train and evaluate the model
trainer.train()
eval_results = trainer.evaluate()

print(f"Evaluation Results: {eval_results}")

# Save the model
model.save_pretrained('./scam_detector_model')
tokenizer.save_pretrained('./scam_detector_model')
