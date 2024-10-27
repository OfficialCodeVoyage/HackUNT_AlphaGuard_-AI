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
import { fetchCalls, fetchStatistics, uploadFile } from "@/lib/api";
import { Call } from "@/types";

export default function Dashboard() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [totalCalls, setTotalCalls] = useState(0);
    const [spamCalls, setSpamCalls] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Call[]>([]);

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
        if (!files) return;

        setIsUploading(true);
        setUploadProgress(0);

        const uploadedCalls: Call[] = [];

        for (let i = 0; i < files.length; i++) {
            try {
                const call = await uploadFile(files[i]);
                uploadedCalls.push(call);
                setUploadProgress(((i + 1) / files.length) * 100);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }

        setIsUploading(false);
        setUploadProgress(100);
        setUploadedFiles(uploadedCalls);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">
                Spam Call Filter Dashboard
            </h1>
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

                {/* Container for split Spam Description cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Spam Details</CardTitle>
                            <CardDescription>
                                
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Educate User about the spam */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>How to Avoid</CardTitle>
                            <CardDescription>
                                
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Educate User on avoiding error */}
                        </CardContent>
                    </Card>
                </div>    
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
