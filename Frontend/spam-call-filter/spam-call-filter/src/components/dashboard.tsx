"use client"; // Enables client-side rendering for this component.

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
import CallLog from "./call-log"; // Component to display the call log
import CallChart from "./call-chart"; // Component to display call statistics as a chart
import CallTranscription from "./call-transcription"; // Component to display call transcription and spam analysis
import { fetchCalls, fetchStatistics, uploadFile } from "@/lib/api"; // API functions for fetching data and file upload
import { Call } from "@/types"; // Type definition for Call objects

export default function Dashboard() {
    // State variables for managing the call data, statistics, file upload, and selected call
    const [calls, setCalls] = useState<Call[]>([]);
    const [totalCalls, setTotalCalls] = useState(0);
    const [spamCalls, setSpamCalls] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Call[]>([]);

    // useEffect hook to fetch call data and statistics on component load and at intervals
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch call data and statistics concurrently
                const [callsData, statsData] = await Promise.all([
                    fetchCalls(),
                    fetchStatistics(),
                ]);
                setCalls(callsData); // Update call log
                setTotalCalls(statsData.totalCalls); // Update total calls count
                setSpamCalls(statsData.spamCalls); // Update spam calls count
            } catch (error) {
                console.error("Error fetching data:", error); // Handle any data fetching errors
            }
        };

        fetchData(); // Initial data fetch
        const interval = setInterval(fetchData, 5000); // Refresh data every 5 seconds

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    // Function to handle file uploads, updating progress and storing uploaded files
    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (!files) return;

        setIsUploading(true);
        setUploadProgress(0);

        const uploadedCalls: Call[] = []; // Array to store uploaded call data

        for (let i = 0; i < files.length; i++) {
            try {
                const call = await uploadFile(files[i]); // Upload each file
                uploadedCalls.push(call); // Add uploaded call to list
                setUploadProgress(((i + 1) / files.length) * 100); // Update progress
            } catch (error) {
                console.error("Error uploading file:", error); // Log any upload errors
            }
        }

        setIsUploading(false);
        setUploadProgress(100);
        setUploadedFiles(uploadedCalls); // Update state with uploaded files
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">
                Spam Call Filter Dashboard
            </h1>

            {/* Call Log and Spam Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Call Log</CardTitle>
                        <CardDescription>
                            Real-time incoming calls
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Display list of incoming calls */}
                        <CallLog calls={calls} onSelectCall={setSelectedCall} />
                    </CardContent>
                </Card>

                {/* Split Spam Description section with 'Spam Details' and 'How to Avoid' */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Spam Explanation</CardTitle>
                            <CardDescription>
                                {/* Add description or spam information here */}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Educate user about spam details */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>How to Avoid</CardTitle>
                            <CardDescription>
                                {/* Add instructions on how to avoid spam calls */}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Guide user on avoiding scams */}
                        </CardContent>
                    </Card>
                </div>    
            </div>

            {/* File Upload Section */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>File Upload</CardTitle>
                    <CardDescription>
                        Upload call recordings for analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        {/* File input for uploading multiple recordings */}
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

            {/* Display Analysis for Uploaded Calls */}
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

            {/* Display Selected Call Analysis */}
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
