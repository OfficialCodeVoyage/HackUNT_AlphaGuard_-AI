"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneCall, ShieldCheck, ShieldAlert, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CallLog from "./call-log";
import CallChart from "./call-chart";
import CallTranscription from "./call-transcription";

type Call = {
    id: number;
    number: string;
    timestamp: Date;
    isSpam: boolean;
    spamWords: string[];
    transcription: string;
    spamProbability: number;
};

export default function Dashboard() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [totalCalls, setTotalCalls] = useState(0);
    const [spamCalls, setSpamCalls] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Call[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newCall: Call = generateCall();
            setCalls((prevCalls) => [newCall, ...prevCalls].slice(0, 100));
            setTotalCalls((prev) => prev + 1);
            if (newCall.isSpam) {
                setSpamCalls((prev) => prev + 1);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const generateCall = (): Call => {
        const spamWords = [
            "urgent",
            "limited time",
            "act now",
            "free",
            "guarantee",
            "credit card",
        ];
        const isSpam = Math.random() < 0.3;
        const detectedSpamWords = isSpam
            ? spamWords.filter(() => Math.random() < 0.5)
            : [];
        return {
            id: Date.now(),
            number: generatePhoneNumber(),
            timestamp: new Date(),
            isSpam,
            spamWords: detectedSpamWords,
            transcription: generateTranscription(isSpam),
            spamProbability: isSpam
                ? Math.random() * 0.5 + 0.5
                : Math.random() * 0.3,
        };
    };

    const generatePhoneNumber = () => {
        return `+1${Math.floor(Math.random() * 1000000000)
            .toString()
            .padStart(9, "0")}`;
    };

    const generateTranscription = (isSpam: boolean) => {
        const spamPhrases = [
            "You've won a free vacation!",
            "Limited time offer on credit card rates!",
            "Urgent: Your account needs attention!",
        ];
        const normalPhrases = [
            "Hi, this is John from the office.",
            "I'm calling about your appointment tomorrow.",
            "Can you please call me back when you have a moment?",
        ];
        return isSpam
            ? spamPhrases[Math.floor(Math.random() * spamPhrases.length)]
            : normalPhrases[Math.floor(Math.random() * normalPhrases.length)];
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setIsUploading(true);
        setUploadProgress(0);

        const uploadedCalls: Call[] = [];

        const processFile = (index: number) => {
            if (index >= files.length) {
                setIsUploading(false);
                setUploadProgress(100);
                setUploadedFiles(uploadedCalls);
                return;
            }

            // Simulate file processing
            setTimeout(() => {
                const newCall = generateCall();
                uploadedCalls.push(newCall);
                setUploadProgress(((index + 1) / files.length) * 100);
                processFile(index + 1);
            }, 1000);
        };

        processFile(0);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">
                Spam Call Filter Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Calls
                        </CardTitle>
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCalls}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Spam Calls
                        </CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{spamCalls}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Filtered Calls
                        </CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalCalls - spamCalls}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Call Log</CardTitle>
                        <CardDescription>
                            Real-time incoming calls
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CallLog calls={calls} onSelectCall={setSelectedCall} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Call Statistics</CardTitle>
                        <CardDescription>
                            Spam vs. Non-Spam Calls
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CallChart
                            spamCalls={spamCalls}
                            nonSpamCalls={totalCalls - spamCalls}
                        />
                    </CardContent>
                </Card>
            </div>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>File Upload</CardTitle>
                    <CardDescription>
                        Upload call recordings for analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        {isUploading && (
                            <Progress
                                value={uploadProgress}
                                className="w-[60%]"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
            {uploadedFiles.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Uploaded Call Analysis</CardTitle>
                        <CardDescription>
                            Transcripts and spam analysis for uploaded calls
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {uploadedFiles.map((call) => (
                                <CallTranscription key={call.id} call={call} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
            {selectedCall && (
                <Card>
                    <CardHeader>
                        <CardTitle>Call Transcription and Analysis</CardTitle>
                        <CardDescription>
                            Detailed information about the selected call
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CallTranscription call={selectedCall} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
