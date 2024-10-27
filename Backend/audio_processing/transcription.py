import azure.cognitiveservices.speech as speechsdk
import asyncio
import os
import uuid
import logging
import dotenv

dotenv.load_dotenv()

# Replace these with your Azure Speech Service credentials
# speech_key = os.getenv('SPEECH_KEY')
# service_region = os.getenv('SERVICE_REGION')
speech_key = "SZjaQ7JRdP4AQaw0EM8qV9Bc1hXs4hDARfPetfvXjtFX2X62NANgJQQJ99AJACYeBjFXJ3w3AAAYACOGRUYn"
service_region="eastus"
print(speech_key)
print(service_region)

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

        # Perform transcription
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, speech_recognizer.recognize_once)

        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            logger.info(f'Transcription successful: {result.text}')
            return result.text
        elif result.reason == speechsdk.ResultReason.NoMatch:
            logger.warning('No speech could be recognized.')
            return ''
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            logger.error(f"Speech Recognition canceled: {cancellation_details.reason}")
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                logger.error(f"Error details: {cancellation_details.error_details}")
            return ''
        else:
            logger.warning(f"Transcription failed. Reason: {result.reason}")
            return ''
    except Exception as e:
        logger.error(f"Exception during transcription: {e}")
        return ''
    finally:
        # Ensure the speech recognizer is released
        del speech_recognizer
        del audio_input

        # Wait briefly to ensure file handles are released
        await asyncio.sleep(0.1)

        # Clean up the temporary file
        if os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
                logger.debug(f'Temporary file {temp_filename} removed.')
            except Exception as e:
                logger.error(f"Error removing temporary file: {e}")
