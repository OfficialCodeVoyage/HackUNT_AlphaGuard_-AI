import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Call } from "@/types";

// Call log component to display a scrollable list of calls
export default function CallLog({
    calls,
    onSelectCall,
}: {
    calls: Call[];
    onSelectCall: (call: Call) => void;
}) {
    return (
        <ScrollArea className="h-[400px]">
            <div className="space-y-2">
                {calls
                    .filter((call) => call.isSpam) // Only show spam calls
                    .map((call) => (
                    <div
                        key={call.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                        <div>
                            <p className="font-medium">{call.number}</p>
                            <p className="text-sm text-muted-foreground">
                                {/* Format timestamp for readability */}
                                {new Date(call.timestamp).toLocaleTimeString()}
                            </p>
                            {call.spamWords.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {/* Display spam words as badges */}
                                    {call.spamWords.map((word, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {word}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Badge indicating if the call is spam */}
                            <Badge
                                variant={
                                    call.isSpam ? "destructive" : "secondary"
                                }
                            >
                                {call.isSpam ? "Spam" : "Safe"}
                            </Badge>
                            {/* Button to select a call for detailed analysis */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSelectCall(call)}
                            >
                                Details
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
