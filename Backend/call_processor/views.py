# twilio_app/views.py
from django.http import HttpResponse
from twilio.twiml.voice_response import VoiceResponse
from django.views.decorators.csrf import csrf_exempt  # Import csrf_exempt

@csrf_exempt  # Disable CSRF for this view
def incoming_call(request):
    response = VoiceResponse()
    # Start recording the call for 120 seconds
    response.record(action='/recording-callback/', maxLength=120)
    return HttpResponse(str(response), content_type='text/xml')

@csrf_exempt  # Disable CSRF for this view
def recording_callback(request):
    recording_url = request.POST.get('RecordingUrl')
    print(f"Recording URL: {recording_url}")  # Process the recording URL as needed
    return HttpResponse("Recording received.")
