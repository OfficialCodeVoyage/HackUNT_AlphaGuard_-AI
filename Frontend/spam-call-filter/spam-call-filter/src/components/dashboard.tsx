"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneCall, ShieldCheck, ShieldAlert, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CallLog from "./call-log";
import CallChart from "./call-chart";
import CallTranscription from "./call-transcription";
import { fetchCalls, fetchStatistics, sendAudioFile } from "@/lib/api";
import { Call } from "@/types";
import EnhancedSpinner from "./enhanced-spinner";

export default function Dashboard() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [responseData, setResponseData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [callsData] = await Promise.all([fetchCalls()]);
                setCalls(callsData);
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
            // Simulate progress updates
            const progressInterval = setInterval(() => {
                setUploadProgress((prevProgress) => {
                    const newProgress = prevProgress + 10;
                    return newProgress > 90 ? 90 : newProgress;
                });
            }, 500);

            // Send the audio file to the backend
            const response = await sendAudioFile(audioFile);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Update the state with the full response data
            setResponseData(response);
        } catch (error) {
            console.error("Error uploading audio file:", error);
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500); // Keep the 100% progress visible briefly
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-center mb-6">
                <PhoneCall className="h-12 w-12 text-primary mr-4" />
                <h1 className="text-4xl font-bold text-primary">SpamShield</h1>
            </div>

            {responseData && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            Transcription and Scam Detection Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CallTranscription data={responseData} />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Upload WAV File</CardTitle>
                    <CardDescription>
                        Upload a WAV audio file for transcription and scam
                        detection
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full">
                            <Input
                                type="file"
                                accept=".wav"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="sr-only"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary cursor-pointer"
                            >
                                <Upload
                                    className="mr-2 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                                <span>Choose WAV file</span>
                            </label>
                        </div>
                        <Button
                            disabled={isUploading}
                            onClick={() =>
                                document.getElementById("file-upload")?.click()
                            }
                            className="w-full sm:w-auto"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                        </Button>
                    </div>
                    {isUploading && (
                        <div className="mt-4 space-y-4">
                            <Progress
                                value={uploadProgress}
                                className="w-full"
                            />
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <EnhancedSpinner size={60} />
                                <span className="text-sm font-medium text-muted-foreground">
                                    Processing audio...
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <CardTitle>Call Analysis</CardTitle>
                        <CardDescription>
                            Detailed information about selected calls
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedCall && selectedCall.scam_result ? (
                            <CallTranscription data={selectedCall} />
                        ) : (
                            <p className="text-center text-muted-foreground">
                                Select a call from the log to view its analysis
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
