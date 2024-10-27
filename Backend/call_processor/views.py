# twilio_app/views.py
import requests
from django.http import HttpResponse, JsonResponse
from twilio.twiml.voice_response import VoiceResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from requests.auth import HTTPBasicAuth  # Import HTTPBasicAuth
import time  # Import time module for delays

@csrf_exempt
def incoming_call(request):
    response = VoiceResponse()
    response.record(action='/recording-callback/', maxLength=120)
    return HttpResponse(str(response), content_type='text/xml')

@csrf_exempt
def recording_callback(request):
    recording_url = request.POST.get('RecordingUrl')
    recording_sid = request.POST.get('RecordingSid')

    if not recording_url or not recording_sid:
        print("Missing RecordingUrl or RecordingSid in the request.")
        return HttpResponse("Bad Request: Missing RecordingUrl or RecordingSid.", status=400)

    print(f"Recording URL: {recording_url}")
    print(f"Recording SID: {recording_sid}")

    audio_file_url = recording_url + '.wav'

    max_retries = 10  # Maximum retries to download the recording
    retry_delay = 15  # Wait 15 seconds between each retry

    for attempt in range(max_retries):
        time.sleep(retry_delay)
        try:
            # Attempt to download the recording
            audio_file = requests.get(audio_file_url, auth=HTTPBasicAuth(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN))
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            continue

        if audio_file.status_code == 200 and audio_file.content:
            # Send the recording to the local endpoint
            send_to_endpoint(audio_file.content, recording_sid)
            return HttpResponse("Recording received and processed successfully.", status=200)
        elif audio_file.status_code == 404:
            print(f"Attempt {attempt + 1}: Recording not found, retrying in {retry_delay} seconds...")
        else:
            print(f"Failed to download recording: {audio_file.status_code}, {audio_file.text}")
            return HttpResponse(f"Failed to download recording: {audio_file.status_code}", status=audio_file.status_code)

    print("Max retries reached. Recording not available.")
    return HttpResponse("Max retries reached. Recording not available.", status=404)

def send_to_endpoint(audio_content, recording_sid):
    target_url = 'http://127.0.0.1:8000/audio/receive/'

    # Prepare the POST request with file
    files = {
        'audio': (f'recording_{recording_sid}.wav', audio_content, 'audio/wav')
    }

    # Debugging: Print the file details
    print(f"Sending file with SID: {recording_sid}")
    print(f"File content length: {len(audio_content)}")

    # Send the POST request with correct headers
    try:
        response = requests.post(target_url, files=files)

        # Log the response details for better debugging
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")
        print(f"Response Content: {response.text}")

        if response.status_code == 200:
            print("Audio file sent successfully!")
        elif response.status_code == 400:
            print(f"Bad Request: {response.text} - This usually means the file was not properly attached or the endpoint is not processing it correctly.")
        else:
            print(f"Failed to send audio file: {response.status_code}, {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while sending the file: {e}")

@csrf_exempt
def receive_audio(request):
    if request.method == 'POST':
        if not request.FILES:
            print("No files were found in the request. Request.FILES:", request.FILES)
            return JsonResponse({'error': 'No files found in request'}, status=400)

        if 'audio' not in request.FILES:
            print("No 'audio' key in request.FILES. Request.FILES content:", request.FILES)
            return JsonResponse({'error': 'No audio file provided'}, status=400)

        audio_file = request.FILES['audio']
        print(f"Received audio file: {audio_file.name}")
        
        # Save the audio file or process it as needed
        try:
            with open(f"/tmp/{audio_file.name}", "wb") as f:
                for chunk in audio_file.chunks():
                    f.write(chunk)
            print("Audio file successfully saved.")
        except Exception as e:
            print(f"Error while saving the audio file: {e}")
            return JsonResponse({'error': f'Error saving file: {e}'}, status=500)

        return JsonResponse({'message': 'File received successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
