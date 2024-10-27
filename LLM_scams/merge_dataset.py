import pandas as pd

# Load the original Excel file
original_df = pd.read_excel('FullTranscriptData.xlsx')

# Load the augmented CSV data
augmented_df = pd.read_csv('augmented_phone_scams.csv')

# Optional: Verify columns are consistent
print("Original Columns:", original_df.columns.tolist())
print("Augmented Columns:", augmented_df.columns.tolist())

# Rename columns in augmented_df to match original_df
augmented_df.rename(columns={
    'id': 'ID',
    'source': 'Source',
    'content': 'Content',
    'char len': 'Char_Len'
}, inplace=True)

# Combine the dataframes
combined_df = pd.concat([original_df, augmented_df], ignore_index=True)

# Optional: Remove duplicates based on 'ID' or other criteria
combined_df.drop_duplicates(subset=['ID'], inplace=True)

# Fill NaN values in 'Content' column with an empty string
combined_df['Content'].fillna('', inplace=True)

# Recalculate 'Char_Len'
combined_df['Char_Len'] = combined_df['Content'].apply(len)

# Save the combined data back to CSV
combined_df.to_csv('combined_dataset.csv', index=False)

print("Data merged successfully and saved to 'combined_dataset.csv'.")