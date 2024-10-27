# Real-Time Scam Monitoring Dashboard

This Next.js application provides a real-time monitoring dashboard for detecting and analyzing potential scam phone calls. The application tracks incoming calls, performs spam analysis in real-time to protect users from scammers.

## Features

- **Real-Time Call Log**: Displays incoming calls and flags potential spam.
- **Spam Analysis**: Analyzes calls for spam probability and detected spam words.
- **File Upload**: Allows users to upload recorded calls for additional spam analysis.
- **Detailed Transcription**: Provides call transcriptions with analysis and recommendations on handling potential spam calls.
- **User Education**: Offers guidance on identifying and avoiding scam calls.

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

## Dependencies

- **Next.js**: Framework for server-rendered React applications.
- **Tailwind CSS**: Utility-first CSS framework for custom styling.
- **Lucide-React**: Icons for UI elements.
- **React**: Library for building user interfaces.

## Notes

- Calls are broken by every 5 seconds to keep the data updated near real-time.

## License

---
