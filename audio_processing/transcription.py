import azure.cognitiveservices.speech as speechsdk
import asyncio
import os
import uuid
import logging
import dotenv

dotenv.load_dotenv()

# Replace these with your Azure Speech Service credentials
speech_key = os.getenv('SPEECH_KEY')
service_region = os.getenv('SERVICE_REGION')

logger = logging.getLogger(__name__)


async def transcribe_audio_chunk(audio_file):
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)

    # Determine the file extension
    file_extension = os.path.splitext(audio_file.name)[1].lower()
    if file_extension not in ['.wav', '.mp3']:
        logger.error(f'Unsupported audio format: {file_extension}')
        raise ValueError('Unsupported audio format. Please upload WAV or MP3 files.')

    # Generate a unique temporary filename to prevent conflicts
    temp_filename = f"temp_audio_{uuid.uuid4()}{file_extension}"

    try:
        # Save the uploaded file to the temporary location
        with open(temp_filename, 'wb+') as temp_file:
            for chunk in audio_file.chunks():
                temp_file.write(chunk)

        # Configure Azure Speech SDK with the correct audio format
        audio_input = speechsdk.audio.AudioConfig(filename=temp_filename)
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)

        # Perform transcription in a separate thread to avoid blocking
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, speech_recognizer.recognize_once)

        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            logger.info('Transcription successful.')
            return result.text
        else:
            logger.warning('No speech could be recognized.')
            return ''
    except Exception as e:
        logger.error(f"Exception during transcription: {e}")
        return ''
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            logger.debug(f'Temporary file {temp_filename} removed.')