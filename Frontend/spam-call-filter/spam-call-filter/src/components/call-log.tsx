import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type Call = {
    id: number;
    number: string;
    timestamp: Date;
    isSpam: boolean;
    spamWords: string[];
};

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
                {calls.map((call) => (
                    <div
                        key={call.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                        <div>
                            <p className="font-medium">{call.number}</p>
                            <p className="text-sm text-muted-foreground">
                                {call.timestamp.toLocaleTimeString()}
                            </p>
                            {call.spamWords.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
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
                            <Badge
                                variant={
                                    call.isSpam ? "destructive" : "secondary"
                                }
                            >
                                {call.isSpam ? "Spam" : "Safe"}
                            </Badge>
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
