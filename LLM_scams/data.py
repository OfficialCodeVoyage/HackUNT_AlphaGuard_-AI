import pandas as pd
from faker import Faker
import random

# Initialize Faker
fake = Faker()

# Define a list of common phone scam templates
scam_templates = [
    "Hello, this is {name} from {agency}. Your {service} has been flagged for {issue}. Please provide your {info} to resolve this.",
    "Congratulations! You've been selected for a {offer}. To claim your prize, please confirm your {details}.",
    "Urgent: Your {account} has been compromised. Please call us back immediately at {phone_number} to secure your funds.",
    "This is {role} from {company}. We've detected a {problem} on your device. Please grant us {access} to fix the issue.",
    "Dear {customer}, there's been unusual activity on your {service}. Please verify your identity by providing your {credentials}.",
    "Hello, you've been selected for a {trial} of our {service}. To activate, please enter your {personal_info}.",
    "Attention: Your {vehicle} registration is expired. To avoid fines, please call our office with your {license_info}.",
    "Hi, this is {name} from {provider}. We've detected unauthorized usage on your {account}. Please verify your {details}.",
    "Emergency: Your {identity} has been compromised. To protect yourself, please provide your {personal_info}.",
    "Hello! We're conducting a {survey} for new {products}. Your input is valuable. Please answer a few questions to participate."
]

# Define possible values for placeholders
agencies = ["IRS", "Bank Security", "Tech Support", "Mobile Provider", "Vehicle Department"]
services = ["bank account", "credit card", "mobile service", "vehicle registration", "email account"]
issues = ["suspicious activity", "unauthorized access", "compromised security", "unusual behavior"]
offers = ["$10,000 gift card", "free premium subscription", "complimentary voucher"]
details_list = ["your credit card number", "your Social Security Number (SSN)", "your account details"]
accounts = ["bank account", "email account", "social media account"]
problems = ["virus infection", "data breach", "unauthorized access"]
access_types = ["remote access", "administrator privileges"]
credentials = ["password", "PIN", "security questions"]
trials = ["free trial", "complimentary access"]
personal_infos = ["personal information", "contact details", "full name and date of birth"]
vehicles = ["vehicle", "car", "motorcycle"]
license_infos = ["driver's license number", "vehicle identification number (VIN)"]
identity_types = ["identity", "personal identity"]
surveys = ["survey", "market research"]
products = ["financial products", "new services", "exclusive offers"]
roles = ["Officer", "Agent", "Support Specialist", "Representative"]
names = [fake.name() for _ in range(10)]  # Generate 10 random names

# Function to generate a single scam message
def generate_scam_message():
    template = random.choice(scam_templates)
    message = template.format(
        name=random.choice(names),
        agency=random.choice(agencies),
        service=random.choice(services),
        issue=random.choice(issues),
        offer=random.choice(offers),
        details=random.choice(details_list),
        account=random.choice(accounts),
        problem=random.choice(problems),
        access=random.choice(access_types),
        customer=fake.first_name(),
        credentials=random.choice(credentials),
        trial=random.choice(trials),
        personal_info=random.choice(personal_infos),
        vehicle=random.choice(vehicles),
        license_info=random.choice(license_infos),
        identity=random.choice(identity_types),
        survey=random.choice(surveys),
        products=random.choice(products),
        role=random.choice(roles),
        company=random.choice(["XYZ Corp", "ABC Ltd", "Global Tech"]),
        provider=random.choice(["Verizon", "AT&T", "T-Mobile"]),
        phone_number=fake.phone_number(),
        info=random.choice(details_list)  # Added the 'info' key
    )
    return message

# Generate a specified number of scam records
def generate_scam_data(num_records):
    data = []
    for _ in range(num_records):
        record = {
            'id': fake.uuid4(),
            'source': 'Phone',
            'content': generate_scam_message(),
            'char len': 0  # Placeholder, will be updated
        }
        record['char len'] = len(record['content'])
        data.append(record)
    return data

# Number of records to generate
num_records = 300

# Generate the data
additional_scam_data = generate_scam_data(num_records)

# Create a DataFrame
df_additional = pd.DataFrame(additional_scam_data)

# Save to CSV
df_additional.to_csv('augmented_phone_scams.csv', index=False)

print(f"Generated {num_records} additional phone scam records and saved to 'augmented_phone_scams.csv'.")