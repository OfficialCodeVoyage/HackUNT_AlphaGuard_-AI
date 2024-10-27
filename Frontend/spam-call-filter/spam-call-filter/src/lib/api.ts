// lib/api.ts

const API_URL = "http://127.0.0.1:8000/audio"; // Your Django server URL

export async function sendAudioFile(audioFile: File) {
    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await fetch(`${API_URL}/receive/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload audio file");
    }

    return response.json();
}

// Dummy data for calls
const dummyCalls = [
    {
        id: 1,
        number: "+1234567890",
        timestamp: new Date().toISOString(),
        isSpam: true,
        spamProbability: 0.85,
        spamWords: ["urgent", "account locked"],
        transcription: "This is a scam call warning.",
        analysisSummary: "Detected urgent language, account warning.",
        scam_result: {
            ai_analysis: {
                is_scam: "Yes",
                confidence_score: 0.85,
                concerning_elements: [
                    "Urgency and pressure tactics",
                    "Request for sensitive information",
                ],
                recommended_action: "Do not respond. Block the number.",
                explanation: "The message contains several scam indicators.",
            },
        },
    },
    {
        id: 2,
        number: "+0987654321",
        timestamp: new Date().toISOString(),
        isSpam: false,
        spamProbability: 0.2,
        spamWords: [],
        transcription: "This is a safe call.",
        analysisSummary: "No concerning elements detected.",
        scam_result: {
            ai_analysis: {
                is_scam: "No",
                confidence_score: 0.2,
                concerning_elements: [],
                recommended_action: "No action required.",
                explanation: "No indicators of a scam were detected.",
            },
        },
    },
];

// Dummy data for statistics
const dummyStatistics = {
    totalCalls: 100,
    spamCalls: 40,
};

export async function fetchCalls() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return dummyCalls;
}

export async function fetchStatistics() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return dummyStatistics;
}
