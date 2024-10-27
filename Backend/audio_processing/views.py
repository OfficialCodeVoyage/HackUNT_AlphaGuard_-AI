# audio_processing/views.py

from asgiref.sync import sync_to_async
import asyncio
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .transcription import transcribe_audio_chunk
from .nlp_analysis import analyze_transcript
import logging
import datetime
import json

logger = logging.getLogger('audio_processing')
from .scam_detection import check_scam

@csrf_exempt
async def receive_audio(request):
    logger.warning('received audio')

    if request.method != 'POST':
        logger.warning('Invalid request method received.')
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    audio_file = request.FILES.get('audio')
    if not audio_file:
        logger.warning('No audio file provided in the request.')
        return JsonResponse({'error': 'No audio file provided'}, status=400)

    try:
        # Initialize session if not already done
        session_key = await sync_to_async(getattr)(request.session, 'session_key')
        if not session_key:
            await sync_to_async(request.session.create)()

        # Asynchronously process the audio chunk
        transcript, scam_result = await handle_audio_chunk(request, audio_file)
        logger.info('Audio chunk processed successfully.')

        # Return the transcript and scam detection result in the response
        return JsonResponse({
            'status': 'Transcription and scam detection successful',
            'transcript': transcript,
            'scam_result': scam_result
        })
    except ValueError as ve:
        logger.error(f"ValueError: {ve}")
        return JsonResponse({'error': str(ve)}, status=400)
    except Exception as e:
        logger.error(f"Error processing audio chunk: {e}")
        return JsonResponse({'error': 'Error processing audio chunk'}, status=500)



# audio_processing/views.py





@csrf_exempt
async def handle_audio_chunk(request, audio_file):
    logger.warning('inside handle audio chunk')

    # Transcribe the audio chunk
    transcript = await transcribe_audio_chunk(audio_file)

    if not transcript:
        logger.warning('No transcription result obtained.')
        return '', {}

    # Retrieve current transcripts from the session
    transcripts = await sync_to_async(request.session.get)('transcripts', [])

    # Append the new transcript
    transcripts.append(transcript)

    # Save back to the session
    await sync_to_async(request.session.__setitem__)('transcripts', transcripts)

    # Log the cumulative transcript
    cumulative_transcript = ' '.join(transcripts)
    logger.info(f'Cumulative Transcript: {cumulative_transcript}')

    # Perform Scam Detection using OpenAI
    scam_result = check_scam(cumulative_transcript)

    # Log the scam detection result
    logger.info(f'Scam Detection Result: {scam_result}')

    # Optionally, store scam result in the session
    await sync_to_async(request.session.__setitem__)('scam_result', scam_result)

    return transcript, scam_result

@csrf_exempt
async def end_conversation(request):
    if request.method != 'POST':
        logger.warning('Invalid request method for ending conversation.')
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        # Retrieve transcripts and analysis results from the session
        transcripts = await sync_to_async(request.session.get)('transcripts', [])
        analysis_results = await sync_to_async(request.session.get)('analysis_results', {})

        if not transcripts:
            logger.warning('No transcripts found to save.')
            return JsonResponse({'error': 'No transcripts to save.'}, status=400)

        cumulative_transcript = ' '.join(transcripts)

        # Define the filename with timestamp
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"transcript_{timestamp}.txt"

        # Save the transcript to a file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(cumulative_transcript)

        logger.info(f'Transcript saved as {filename}.')

        # Reset the session
        await sync_to_async(request.session.flush)()

        # Ensure analysis results are JSON-serializable
        analysis_results_serializable = json.loads(json.dumps(analysis_results, default=str))

        return JsonResponse({
            'status': 'Conversation ended and transcript saved.',
            'filename': filename,
            'analysis_results': analysis_results_serializable
        })
    except Exception as e:
        logger.error(f"Error ending conversation: {e}")
        return JsonResponse({'error': 'Error ending conversation.'}, status=500)
