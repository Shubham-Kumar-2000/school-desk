package com.example.schooldesk

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.example.schooldesk.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initWebApp()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun initWebApp() {
        val settings = binding.webview.settings
        settings.useWideViewPort = true
        settings.javaScriptEnabled = true
        settings.loadsImagesAutomatically = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        binding.webview.loadUrl(Constants.WEB_URL)


        binding.webview.webViewClient = object : WebViewClient() {
            override fun onReceivedError(
                view: WebView?, request: WebResourceRequest?, error: WebResourceError?
            ) {
                Log.e("WebViewError", "Error: ${error?.description}")
            }
        }
    }
}