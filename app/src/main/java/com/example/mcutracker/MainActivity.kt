package com.example.mcutracker

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.example.mcutracker.ui.McuTrackerScreen
import com.example.mcutracker.ui.McuTrackerViewModel
import com.example.mcutracker.ui.theme.McuTrackerTheme

class MainActivity : ComponentActivity() {
    private val viewModel: McuTrackerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val uiState by viewModel.uiState.collectAsState()
            McuTrackerTheme(heroThemeKey = uiState.preferences.heroTheme) {
                McuTrackerScreen(viewModel = viewModel)
            }
        }
    }
}
