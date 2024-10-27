import kagglehub

# Download latest version
path = kagglehub.dataset_download("rivalcults/youtube-scam-phone-call-transcripts")

print("Path to dataset files:", path)