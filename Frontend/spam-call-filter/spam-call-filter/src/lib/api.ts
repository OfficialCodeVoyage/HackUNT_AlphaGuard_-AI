import { Call } from "@/types";

const API_URL = "http://127.0.0.1:8000";

// Dummy data
const dummyCalls: Call[] = [
    {
        id: 1,
        number: "+1234567890",
        timestamp: new Date().toISOString(),
        isSpam: true,
        spamWords: ["urgent", "limited time"],
        transcription: "This is an urgent message about a limited time offer!",
        spamProbability: 0.85,
    },
    {
        id: 2,
        number: "+1987654321",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        isSpam: false,
        spamWords: [],
        transcription:
            "Hi, this is John from the office. Can you call me back when you have a moment?",
        spamProbability: 0.02,
    },
    {
        id: 3,
        number: "+1122334455",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        isSpam: true,
        spamWords: ["free", "act now"],
        transcription:
            "You've won a free vacation! Act now to claim your prize!",
        spamProbability: 0.95,
    },
];

let totalCalls = 100;
let spamCalls = 30;

export async function fetchCalls(): Promise<Call[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return dummy data
    return dummyCalls;
}

export async function fetchStatistics(): Promise<{
    totalCalls: number;
    spamCalls: number;
}> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Increment counters to simulate new calls
    totalCalls += Math.floor(Math.random() * 3);
    spamCalls += Math.floor(Math.random() * 2);

    return { totalCalls, spamCalls };
}

export async function uploadFile(file: File): Promise<Call> {
    // Simulate API delay and file processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a dummy call object for the uploaded file
    const isSpam = Math.random() > 0.6;
    const newCall: Call = {
        id: Date.now(),
        number: `+1${Math.floor(Math.random() * 10000000000)
            .toString()
            .padStart(10, "0")}`,
        timestamp: new Date().toISOString(),
        isSpam,
        spamWords: isSpam ? ["suspicious", "upload"] : [],
        transcription: isSpam
            ? "This is a suspicious uploaded file with some spam content."
            : "This is a normal uploaded file with no spam content.",
        spamProbability: isSpam
            ? 0.7 + Math.random() * 0.3
            : Math.random() * 0.3,
    };

    return newCall;
}
