import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CallTranscriptionProps {
    data: {
        status: string;
        transcript: string;
        scam_result: {
            matched_phrases: Record<string, any>;
            ai_analysis: {
                is_scam: string;
                confidence_score: number;
                concerning_elements: string[];
                recommended_action: string;
                explanation: string;
            };
        };
    };
}

export default function CallTranscription({ data }: CallTranscriptionProps) {
    const { status, transcript, scam_result } = data;
    const { ai_analysis } = scam_result;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{status}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="bg-muted p-4 rounded-md">{transcript}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Scam Detection Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="font-semibold">Is Scam:</p>
                        <p>{ai_analysis.is_scam}</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Confidence Score:</p>
                        <Progress
                            value={ai_analysis.confidence_score * 100}
                            className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            {(ai_analysis.confidence_score * 100).toFixed(1)}%
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">
                            Concerning Elements:
                        </p>
                        <ul className="list-disc list-inside">
                            {ai_analysis.concerning_elements.map(
                                (element, index) => (
                                    <li key={index}>{element}</li>
                                )
                            )}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold">Recommended Action:</p>
                        <p>{ai_analysis.recommended_action}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Explanation:</p>
                        <p>{ai_analysis.explanation}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
