package com.example.androidapplication

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.MediaRecorder
import android.telephony.TelephonyManager
import android.util.Log
import java.io.File
import java.io.IOException
import android.os.Handler
import android.os.Looper
import androidx.core.app.ActivityCompat

class CallReceiver : BroadcastReceiver() {
    private var mediaRecorder: MediaRecorder? = null
    private var isRecording = false
    private var outputFile: String? = null
    private val handler = Handler(Looper.getMainLooper())
    private var chunkCounter = 0
    private lateinit var recordingsDir: File // Declare here

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
            val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
            when (state) {
                TelephonyManager.EXTRA_STATE_RINGING -> {
                    val incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)
                    Log.d("CallReceiver", "Incoming call from: $incomingNumber")
                }
                TelephonyManager.EXTRA_STATE_OFFHOOK -> {
                    Log.d("CallReceiver", "Call picked up.")
                    startRecording(context)
                }
                TelephonyManager.EXTRA_STATE_IDLE -> {
                    Log.d("CallReceiver", "Call ended.")
                    stopRecording()
                    // eraseRecording(context) // Uncomment if you want to delete recordings
                }
            }
        }
    }

    private fun startRecording(context: Context) {
        if (isRecording) return // avoid starting multiple recordings

        //check permissions
        if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            Log.e("CallReceiver", "RECORD_AUDIO permission not granted.")
            return
        } else {Log.d("CallReceiver", "RECORD_AUDIO permission granted.")}

        // Create directory for recordings if it doesn't exist
        recordingsDir = File(context.filesDir, "call_recordings")
        if (!recordingsDir.exists()) {
            recordingsDir.mkdirs() // Create the directory
        }

        // Create a new MediaRecorder instance
        mediaRecorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.VOICE_COMMUNICATION)
            setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)

            // Set output file path
            outputFile = "${recordingsDir.absolutePath}/call_recording_${System.currentTimeMillis()}.wav"
            setOutputFile(outputFile)

            try {
                prepare() // prepare the recorder
                start() // Start Recording
                isRecording = true

                Log.d("CallReceiver", "Recording started: $outputFile")

                // Schedule the next chunk recording
                handler.postDelayed({ chunkRecording(context) }, 10000)
            } catch (e: IOException) {
                Log.e("CallReceiver", "Recording failed: ${e.message}")
            }
        }
    }

    private fun stopRecording() {
        if (!isRecording) return

        mediaRecorder?.apply {
            try {
                stop()
                release()
                isRecording = false
                Log.d("CallReceiver", "Recording stopped and saved: $outputFile")
            } catch (e: RuntimeException) {
                Log.e("CallReceiver", "Error stopping recording: ${e.message}")
            }
        }

        mediaRecorder = null // kill the MediaRecorder instance
    }

    private fun chunkRecording(context: Context) {
        // every 10s chunk the recording and send to server
        if (!isRecording) return

        stopRecording()

        // Set new output file path for the next chunk
        outputFile = "${recordingsDir.absolutePath}/call_recording_${System.currentTimeMillis()}.3gp"
        startRecording(context)

        chunkCounter++
        Log.d("CallReceiver", "Chunk $chunkCounter saved: $outputFile")

        // Schedule the next chunk recording
        handler.postDelayed({ chunkRecording(context) }, 10000)
    }

    private fun sendRecording() {
        // Implement sending the recording to the server
    }

    // Optional: Uncomment to erase recordings after call
    /*
    private fun eraseRecording(context: Context) {
        try {
            for (file in recordingsDir.listFiles() ?: arrayOf()) {
                file.delete()
            }
            Log.d("CallReceiver", "All recordings deleted.")
        } catch (e: Exception) {
            Log.e("CallReceiver", "Error deleting files: ${e.message}")
        }
    }
    */
}