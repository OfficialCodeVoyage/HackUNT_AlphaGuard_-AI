import { Badge } from "@/components/ui/badge"; // Badge component for labels
import { Progress } from "@/components/ui/progress"; // Progress bar for spam probability
import { Call } from "@/types"; // Type for call data

// Displays detailed call analysis, including transcription, spam probability, and summary
export default function CallTranscription({ call }: { call: Call }) {
    return (
        <div className="space-y-4 border p-4 rounded-lg">
            {/* Call number and timestamp */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">{call.number}</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(call.timestamp).toLocaleString()}
                    </p>
                </div>
                {/* Spam or Safe status */}
                <Badge variant={call.isSpam ? "destructive" : "secondary"}>
                    {call.isSpam ? "Spam" : "Safe"}
                </Badge>
            </div>

            {/* Call transcription */}
            <div>
                <h3 className="font-semibold mb-2">Transcription:</h3>
                <p className="bg-muted p-3 rounded-md">{call.transcription}</p>
            </div>

            {/* Spam probability */}
            <div>
                <h3 className="font-semibold mb-2">Spam Analysis:</h3>
                <div className="flex items-center space-x-4">
                    <Progress value={call.spamProbability * 100} className="w-[60%]" />
                    <span className="text-sm font-medium">
                        {(call.spamProbability * 100).toFixed(1)}% Spam Probability
                    </span>
                </div>
            </div>

            {/* Detected spam words */}
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

            {/* Analysis summary */}
            <div>
                <h3 className="font-semibold mb-2">Analysis Summary:</h3>
                <p className="text-sm">
                    {call.isSpam
                        ? `This call has a spam probability of ${(
                              call.spamProbability * 100
                          ).toFixed(1)}%. ${
                              call.spamWords.length > 0
                                  ? `Detected words: ${call.spamWords.join(", ")}.`
                                  : "No specific words, but content suggests spam."
                          } Proceed with caution.`
                        : `This call appears safe with a spam probability of ${(
                              call.spamProbability * 100
                          ).toFixed(
                              1
                          )}%. No spam indicators detected.`}
                </p>
            </div>
        </div>
    );
}
