// components/call-transcription.tsx

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Call } from "@/types";

interface CallTranscriptionProps {
    transcript: string;
    scamResult: {
        is_scam: string;
        scam_score: number;
        explanation: string;
    };
    call?: Call;
}

export default function CallTranscription({
    transcript,
    scamResult,
    call,
}: CallTranscriptionProps) {
    // If call prop is provided, use it; otherwise, use transcript and scamResult props
    if (call) {
        transcript = call.transcription;
        scamResult = {
            is_scam: call.isSpam ? "Yes" : "No",
            scam_score: call.spamProbability,
            explanation: call.analysisSummary || "",
        };
    }

    return (
        <div className="space-y-4 border p-4 rounded-lg">
            <div>
                <h3 className="font-semibold mb-2">Transcription:</h3>
                <p className="bg-muted p-3 rounded-md">{transcript}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Scam Detection Result:</h3>
                <p>
                    <strong>Is Scam:</strong> {scamResult.is_scam}
                </p>
                <p>
                    <strong>Scam Score:</strong>{" "}
                    {(scamResult.scam_score * 100).toFixed(1)}%
                </p>
                <p>
                    <strong>Explanation:</strong> {scamResult.explanation}
                </p>
            </div>
        </div>
    );
}
