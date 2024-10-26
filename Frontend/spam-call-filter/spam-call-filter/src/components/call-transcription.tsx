import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Call } from "@/types";

export default function CallTranscription({ call }: { call: Call }) {
    return (
        <div className="space-y-4 border p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">{call.number}</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(call.timestamp).toLocaleString()}
                    </p>
                </div>
                <Badge variant={call.isSpam ? "destructive" : "secondary"}>
                    {call.isSpam ? "Spam" : "Safe"}
                </Badge>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Transcription:</h3>
                <p className="bg-muted p-3 rounded-md">{call.transcription}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Spam Analysis:</h3>
                <div className="flex items-center space-x-4">
                    <Progress
                        value={call.spamProbability * 100}
                        className="w-[60%]"
                    />
                    <span className="text-sm font-medium">
                        {(call.spamProbability * 100).toFixed(1)}% Spam
                        Probability
                    </span>
                </div>
            </div>
            {call.spamWords.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2">Detected Spam Words:</h3>
                    <div className="flex flex-wrap gap-2">
                        {call.spamWords.map((word, index) => (
                            <Badge key={index} variant="outline">
                                {word}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <h3 className="font-semibold mb-2">Analysis Summary:</h3>
                <p className="text-sm">
                    {call.isSpam
                        ? `This call has been identified as potential spam with a ${(
                              call.spamProbability * 100
                          ).toFixed(1)}% probability. ${
                              call.spamWords.length > 0
                                  ? `The following spam indicators were detected: ${call.spamWords.join(
                                        ", "
                                    )}.`
                                  : "No specific spam words were detected, but the overall content suggests spam."
                          } We recommend caution when dealing with this caller.`
                        : `This call appears to be safe with a low spam probability of ${(
                              call.spamProbability * 100
                          ).toFixed(
                              1
                          )}%. No spam indicators were detected in the transcription.`}
                </p>
            </div>
        </div>
    );
}
