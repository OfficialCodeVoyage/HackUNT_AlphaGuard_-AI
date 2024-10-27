import csv
import uuid
import random
from faker import Faker
import pandas as pd

# Initialize Faker
fake = Faker()

# Define possible legitimate phone message sources
phone_sources = ["Phone"] * 300  # 300 Phone messages
youtube_sources = [
                      "https://www.youtube.com/watch?v=example1&ab_channel=LegitSupport",
                      "https://www.youtube.com/watch?v=example2&ab_channel=TechHelp",
                      "https://www.youtube.com/watch?v=example3&ab_channel=CustomerService",
                      "https://www.youtube.com/watch?v=example4&ab_channel=SupportCenter",
                      "https://www.youtube.com/watch?v=example5&ab_channel=HelpDesk"
                  ] * 100  # 200 YouTube messages

# Combine all sources
all_sources = phone_sources + youtube_sources  # Total 500 sources

# Define templates for Phone messages (live transcripts)
phone_call_templates = [
    [
        "Hello, this is {agent_name} from {company_name}. How can I assist you today?",
        "Hi {customer_name}, I'm having an issue with my {product_service}. It's not functioning as expected.",
        "I'm sorry to hear that, {customer_name}. Could you please provide me with your account number?",
        "Sure, it's {account_number}. I recently noticed that my {product_service} is acting up.",
        "Thank you. Let me check your account details. It appears there's an update available for your {product_service}.",
        "Oh, I wasn't aware of that. How do I proceed with the update?",
        "I can guide you through the update process step by step. First, please open the {application_name} on your device.",
        "Alright, I've opened it. What's next?",
        "Great. Now, navigate to the 'Settings' menu and select 'Update Software'.",
        "Done. It seems to be updating now.",
        "Perfect! Once the update is complete, your {product_service} should function correctly.",
        "Thank you so much for your help!",
        "You're welcome! Is there anything else I can assist you with today?",
        "No, that's all. Have a great day!",
        "You too, {customer_name}! Goodbye."
    ],
    [
        "Good morning, {customer_name}. This is {agent_name} from {service_provider}. How can I help you today?",
        "Hello, I received a notification about a charge on my account that I don't recognize.",
        "I'm sorry to hear that. Let me verify your account details. Could you please provide your account number?",
        "Yes, it's {account_number}.",
        "Thank you. I see an unauthorized transaction of ${amount} on your account dated {transaction_date}.",
        "I did not authorize this transaction. What should I do?",
        "I recommend immediately securing your account. I'll guide you through the process of changing your password and reviewing recent activities.",
        "That sounds good. Let's proceed.",
        "Please go to our official website and log in to your account.",
        "Alright, I'm logged in.",
        "Great. Now, navigate to the 'Security Settings' and click on 'Change Password'.",
        "I've updated my password.",
        "Excellent. Next, review the 'Recent Activities' to ensure there are no other unauthorized transactions.",
        "Everything looks fine now.",
        "I'm glad to hear that. If you notice any further suspicious activity, please contact us immediately.",
        "Thank you for your assistance.",
        "You're welcome! Stay safe and have a great day."
    ],
    # Add more templates as needed
]

# Define templates for YouTube transcripts (live call transcripts)
youtube_transcript_templates = [
    [
        "Hello, thank you for calling {company_name} support. My name is {agent_name}. How can I assist you today?",
        "Hi {agent_name}, I'm experiencing issues with my {product_service}. It's not responding when I try to use it.",
        "I'm sorry to hear that you're facing problems. Let's start by troubleshooting. Can you please describe what happens when you try to use the {product_service}?",
        "Sure, whenever I open the application, it freezes and doesn't load any features.",
        "Understood. First, let's ensure that your device meets the minimum system requirements for the {product_service}. Could you provide me with your device specifications?",
        "Yes, I'm using a {device_model} with {ram} RAM and {storage} storage.",
        "Thank you for the information. Your device meets the necessary requirements. Let's try restarting the {product_service}. Please close the application completely and reopen it.",
        "Alright, I've done that, but it's still freezing.",
        "Okay, let's proceed to clear the cache. Navigate to the 'Settings' within the {product_service} and select 'Clear Cache'.",
        "Done. It's still not working.",
        "I see. Let's uninstall and reinstall the {product_service}. This should resolve any corrupted files causing the issue.",
        "Alright, I'll uninstall it now.",
        "Once uninstalled, please download the latest version from our official website and install it.",
        "I've reinstalled it, and it's working perfectly now. Thank you!",
        "I'm glad to hear that. Is there anything else I can assist you with today?",
        "No, that's all. Thanks again!",
        "You're welcome! Have a great day."
    ],
    [
        "Thank you for contacting {company_name} customer service. This is {agent_name} speaking. How may I help you?",
        "Hi {agent_name}, I recently made a purchase, but I haven't received the confirmation email.",
        "I'm sorry for the inconvenience. Could you please provide me with your order number?",
        "Yes, it's {order_number}.",
        "Thank you. Let me check the status of your order. One moment, please.",
        "Sure, take your time.",
        "I've located your order. It was processed successfully and shipped on {shipping_date}. You should receive it by {expected_delivery_date}.",
        "That's great. However, I haven't received any tracking information.",
        "Apologies for that oversight. Let me resend the tracking information to your registered email address.",
        "Thank you, I appreciate it.",
        "You’re welcome! Is there anything else I can assist you with today?",
        "No, that's all for now.",
        "Alright. Thank you for contacting {company_name}. Have a wonderful day!"
    ],
    # Add more templates as needed
]


# Function to generate a legitimate phone call transcript
def generate_legit_phone_transcript():
    scenario_type = random.choice(['Phone', 'YouTube'])

    if scenario_type == 'Phone':
        template = random.choice(phone_call_templates)
    else:
        template = random.choice(youtube_transcript_templates)

    conversation = []

    # Generate dynamic data using Faker and random choices
    dynamic_data = {
        "agent_name": fake.name(),
        "company_name": random.choice(
            ["TechSupport Inc.", "Global Services LLC", "CustomerCare Co.", "HelpDesk Solutions", "ServicePro"]),
        "customer_name": fake.name(),
        "product_service": random.choice(
            ["Smartphone", "Internet Service", "Software Application", "Bank Account", "Streaming Service"]),
        "account_number": str(fake.random_number(digits=8, fix_len=True)),
        "amount": round(random.uniform(50.0, 1000.0), 2),
        "transaction_date": fake.date_between(start_date='-30d', end_date='today').strftime("%B %d, %Y"),
        "device_model": random.choice(
            ["Dell XPS 15", "MacBook Pro", "HP Spectre x360", "Lenovo ThinkPad X1", "Asus ZenBook"]),
        "ram": random.choice(["8GB", "16GB", "32GB"]),
        "storage": random.choice(["256GB SSD", "512GB SSD", "1TB HDD"]),
        "application_name": random.choice(
            ["ServiceApp", "SupportTool", "CustomerPortal", "AccountManager", "UtilityApp"]),
        "order_number": fake.bothify(text='ORD-########'),
        "shipping_date": fake.date_between(start_date='-10d', end_date='-1d').strftime("%B %d, %Y"),
        "expected_delivery_date": fake.date_between(start_date='+1d', end_date='+10d').strftime("%B %d, %Y"),
        "service_provider": random.choice(["Verizon", "AT&T", "T-Mobile", "Sprint", "Comcast"])
    }

    # Populate the conversation using the template and dynamic data
    for line in template:
        conversation_line = line.format(**dynamic_data)
        conversation.append(conversation_line)

    # Join the conversation lines into a single transcript
    transcript = " ".join(conversation)
    return transcript


# Function to generate a unique ID
def generate_id(index):
    # 50% numerical IDs and 50% UUIDs
    if random.random() < 0.5:
        return index
    else:
        return str(uuid.uuid4())


# Prepare data storage
data = []

# Generate 500 non-scam phone messages
for i in range(500):
    msg_id = generate_id(i)
    source = all_sources[i]
    content = generate_legit_phone_transcript()
    char_len = len(content)
    data.append([msg_id, source, content, char_len])

# Define CSV headers
headers = ["ID", "Source", "Content", "Char_Len"]

# Save to CSV
with open("non_scam_phone_messages.csv", "w", newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(data)

print("500 non-scam phone messages have been generated and saved to 'non_scam_phone_messages.csv'.")
