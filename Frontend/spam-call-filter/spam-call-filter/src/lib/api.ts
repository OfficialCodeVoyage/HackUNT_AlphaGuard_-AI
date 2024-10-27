const API_URL = "http://127.0.0.1:8000"; // Your Django server URL

export async function sendAudioFile(audioFile: File) {
    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await fetch(`${API_URL}/receive/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload audio file");
    }

    return response.json();
}
