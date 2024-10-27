# AlphaGuard AI - Real-Time Scam Monitoring Dashboard

**AlphaGuard AI** is a Next.js application offering a real-time monitoring dashboard for detecting and analyzing potential scam phone calls. This dashboard helps users stay alert by analyzing incoming calls in 10-second intervals, leveraging advanced AI and language models to protect users from scammers.

## Inspiration
Almost everyone knows someone who has been scammed by a phone call or spam message. The panic and distress it causes can be heartbreaking, especially when it happens to a loved one. With **AlphaGuard AI**, we aim to end this. Whether for you, your family, or your community, **AlphaGuard AI** stands as the first line of defense in today’s increasingly complex world of digital deception. With **AlphaGuard AI**, you’ll always be one step ahead, empowered and protected.

## What it does
**AlphaGuard AI** is a real-time scam detection solution that monitors phone calls in 10-second intervals, listening for high-risk "stop words" like “buy a gift card” or “don’t hang up.” When these phrases are detected, AlphaGuard AI raises the confidence level of a potential scam based on the severity of the words used. Once this confidence reaches a set threshold, the call is automatically terminated to protect the user. Following the call, AlphaGuard AI educates users about the scam they encountered and provides tips to help them recognize and avoid similar schemes in the future.

## Features

- **Real-Time Call Log**: Displays incoming calls and flags potential spam.
- **Spam Analysis**: Analyzes calls for spam probability and detected spam words.
- **File Upload**: Allows users to upload recorded calls for additional spam analysis.
- **Detailed Transcription**: Provides call transcriptions with analysis and recommendations on handling potential spam calls.
- **User Education**: Offers guidance on identifying and avoiding scam calls.

## How we built it
AlphaGuard AI operates through multiple integrated layers to provide real-time monitoring and spam analysis:

### Layer 1: Phone Number Verification
When a call comes in, **AlphaGuard AI** first verifies the phone number against a list of known scam numbers stored in a database. If the number is flagged as suspicious, the AI prepares for further analysis of the call’s content.

### Layer 2: Real-Time Call Monitoring and Analysis
Using Twilio and Grok for call handling, **AlphaGuard AI** captures real-time audio from calls in 10-second intervals. Audio is transcribed using Azure's OpenAI service, which performs **Natural Language Processing (NLP)** on the transcriptions to detect suspicious language. Our **Language Model (LLM)**, trained on a dataset of scam and non-scam terms, identifies high-risk "stop words" commonly associated with scams. If the NLP model flags these stop words and reaches a high-risk threshold, **AlphaGuard AI** immediately terminates the call.

### Post-Call Education
Following a flagged call, AlphaGuard AI provides users with educational content detailing the type of scam detected, common scam indicators, and tips for avoiding similar schemes. The educational content is customized based on the scam detected, using pre-recorded messages to guide users in identifying scams.

## Challenges we ran into
1. **Voice-to-Text Permissions**: Access to call audio on iOS was limited, so we developed and tested the app primarily on Android, which provides more flexible audio permissions.
2. **Fine-Tuning NLP Model**: Adjusting the NLP model for real-time accuracy required careful tuning with Azure’s language processing and Python integration to ensure high precision in detecting scam language.

## Accomplishments that we're proud of
- **Real-Time Detection**: Successfully implemented real-time detection and call termination based on detected scam phrases.
- **Multi-Layered Protection**: Designed a dual-layer system to verify phone numbers and analyze call content.
- **Educational Impact**: Developed an educational feature to inform users about scam tactics and avoidance tips post-call.

## What we learned
- **Nick** gained skills in Flask for handling real-time data and integrating APIs.
- **Asmitha** expanded her knowledge in Vercel and Next.js for creating responsive and interactive applications. 
- **Pavlo** acquired experience with Azure OpenAI for call data processing and AI model creation.
- **Darshan** improved his expertise in Django for secure data management.

## What's next for AlphaGuard AI
Currently, **AlphaGuard AI** is hosted locally, but we plan to deploy it on the cloud for wider accessibility. Planned enhancements include:
- **Enhanced LLM Training**: Expanding the language model to improve scam detection sensitivity.
- **iOS Compatibility**: Researching alternative solutions for iOS integration.
- **Advanced Scam Scoring**: Developing a secondary AI layer to monitor and score scam likelihood in real-time.
- **Enhanced Notifications**: Implementing real-time alerts to inform users of risky interactions.

## Components

### `Dashboard`
The main dashboard component that integrates various sections:
- **Call Log**: Shows real-time incoming calls and highlights those marked as spam.
- **Spam Analysis Cards**: Educates users about spam patterns and suggests ways to avoid scam interactions.
- **File Upload Section**: Enables users to upload transcribed files for scam analysis.
- **Uploaded Call Analysis**: Displays analysis details for uploaded calls.
- **Call Transcription and Analysis**: Provides detailed transcription and scam probability for selected calls.

### `CallLog`
Displays a scrollable list of incoming calls, highlighting spam calls with badges and allowing users to select specific calls for more details.

### `CallTranscription`
Provides a transcription and spam probability analysis for individual calls. This component shows detected spam words, probability of spam, and offers an analysis summary.

## API and Data Handling

The dashboard relies on the following API functions located in `/lib/api.ts`:

- `fetchCalls()`: Retrieves real-time incoming call data.
- `fetchStatistics()`: Fetches statistics on the number of total and spam calls.
- `uploadFile(file)`: Uploads call recording files for analysis.

### Types

The `Call` type defines the structure for call objects used throughout the application, including fields like `id`, `number`, `timestamp`, `isSpam`, `spamProbability`, and `spamWords`.

## File Structure

- **`components/`**: Contains UI components (`Badge`, `Button`, `Card`, etc.) and specific dashboard components (`CallLog`, `CallTranscription`).
- **`lib/`**: Includes helper functions for fetching data and uploading files.
- **`types/`**: Contains TypeScript definitions for data structures.
- **`pages/`**: Holds Next.js page components, including the main dashboard.

## Usage

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and visit `http://localhost:3000` to access the dashboard.

## Dependencies

- **Next.js**: Framework for server-rendered React applications.
- **Tailwind CSS**: Utility-first CSS framework for custom styling.
- **Lucide-React**: Icons for UI elements.
- **React**: Library for building user interfaces.
- **Azure OpenAI**: Provides the language model for transcribing and analyzing call content.

## License

This project is licensed under the MIT License.
