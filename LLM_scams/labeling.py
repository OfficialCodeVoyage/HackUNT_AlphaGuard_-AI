import pandas as pd

# Load the uploaded files
scam_messages = pd.read_csv('scam_phone_messages.csv')
non_scam_messages = pd.read_csv('non_scam_phone_messages.csv')

# Add label to each dataset
scam_messages['label'] = 'scam'
non_scam_messages['label'] = 'non_scam'

# Combine both datasets into one
combined_messages = pd.concat([scam_messages, non_scam_messages], ignore_index=True)

# Save the combined dataset to a new file
output_path = '/mnt/data/labeled_phone_messages.csv'
combined_messages.to_csv(output_path, index=False)
