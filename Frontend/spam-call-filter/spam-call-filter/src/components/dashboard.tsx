// components/dashboard.tsx

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
import { PhoneCall, ShieldCheck, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CallLog from "./call-log";
import CallChart from "./call-chart";
import CallTranscription from "./call-transcription";
import { fetchCalls, fetchStatistics, sendAudioFile } from "@/lib/api";
import { Call } from "@/types";

export default function Dashboard() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [totalCalls, setTotalCalls] = useState(0);
    const [spamCalls, setSpamCalls] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [transcript, setTranscript] = useState("");
    const [scamResult, setScamResult] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [callsData, statsData] = await Promise.all([
                    fetchCalls(),
                    fetchStatistics(),
                ]);
                setCalls(callsData);
                setTotalCalls(statsData.totalCalls);
                setSpamCalls(statsData.spamCalls);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        const audioFile = files[0];

        try {
            // Send the audio file to the backend
            const response = await sendAudioFile(audioFile);

            // Update the state with the response from the backend
            setTranscript(response.transcript);
            setScamResult(response.scam_result);
            setUploadProgress(100);
        } catch (error) {
            console.error("Error uploading audio file:", error);
        } finally {
            setIsUploading(false);
        }
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
                    <CardTitle>Upload WAV File</CardTitle>
                    <CardDescription>
                        Upload a WAV audio file for transcription and scam
                        detection
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Input
                            type="file"
                            accept=".wav"
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
            {transcript && scamResult && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            Transcription and Scam Detection Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CallTranscription
                            transcript={transcript}
                            scamResult={scamResult}
                        />
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
