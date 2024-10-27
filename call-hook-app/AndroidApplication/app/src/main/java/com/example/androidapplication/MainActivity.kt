package com.example.androidapplication

import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.app.ActivityCompat
import com.example.androidapplication.ui.theme.AndroidApplicationTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Request permissions when the activity is created
        requestPermission()

        setContent {
            AndroidApplicationTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Greeting(
                        name = "Android",
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }

    private fun requestPermission() {
        val permissions = arrayOf(
            android.Manifest.permission.RECORD_AUDIO,
            android.Manifest.permission.READ_MEDIA_AUDIO,
            android.Manifest.permission.READ_PHONE_STATE
        )

        // Check if permissions are already granted
        if (permissions.all { ActivityCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED }) {
            // All permissions are already granted
            return
        }

        // Request permissions from the user
        ActivityCompat.requestPermissions(this, permissions, PERMISSION_REQUEST_CODE)
    }

    // Handle the permission request result
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == PERMISSION_REQUEST_CODE) {
            val deniedPermissions = mutableListOf<String>()

            // Iterate through each permission and check if it was denied
            for (i in permissions.indices) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                    when (permissions[i]) {
                        android.Manifest.permission.RECORD_AUDIO -> {
                            Toast.makeText(this, "Permission denied: Cannot record audio.", Toast.LENGTH_SHORT).show()
                            deniedPermissions.add("Record Audio")
                        }
                        android.Manifest.permission.READ_MEDIA_AUDIO -> {
                            Toast.makeText(this, "Permission denied: Cannot interact to media.", Toast.LENGTH_SHORT).show()
                            deniedPermissions.add("Record Audio")
                        }
                        android.Manifest.permission.READ_PHONE_STATE -> {
                            Toast.makeText(this, "Permission denied: Cannot read phone state.", Toast.LENGTH_SHORT).show()
                            deniedPermissions.add("Record Audio")
                        }
                    }
                }
                else{
                    Log.d("All permissions granted", "All permissions granted")
                    Toast.makeText(this, "SUCCESS! Permission granted: Can record audio.", Toast.LENGTH_SHORT).show()
                }

            }

            // Check if all permissions were granted
            if (deniedPermissions.isEmpty()) {
                Toast.makeText(this, "All permissions granted. Call recording is now active.", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Permissions denied: ${deniedPermissions.joinToString()}", Toast.LENGTH_LONG).show()
            }
        }
    }

    companion object {
        private const val PERMISSION_REQUEST_CODE = 100
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    AndroidApplicationTheme {
        Greeting("Android")
    }
}